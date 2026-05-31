<?php

namespace App\Console\Commands;

use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Illuminate\Console\Command;

class GoogleCalendarOAuthCommand extends Command
{
    protected $signature = 'google:calendar-oauth
                            {code? : Authorization code (only if not using --listen)}
                            {--listen : Start local server to capture the code automatically}
                            {--redirect-uri= : Must match the URL Google redirected to (e.g. http://127.0.0.1:8095)}';

    protected $description = 'Obtain a Google Calendar OAuth refresh token (required for Meet on personal Gmail)';

    public function handle(): int
    {
        $oauthPath = config('google.oauth_client_path');

        if (! is_string($oauthPath) || ! file_exists($oauthPath)) {
            return $this->missingOAuthClient($oauthPath);
        }

        $client = $this->makeOAuthClient($oauthPath);

        if ($this->option('listen')) {
            return $this->listenForAuthorizationCode($client);
        }

        $code = $this->argument('code');

        if (! filled($code)) {
            $this->printManualInstructions($client);

            return self::SUCCESS;
        }

        $redirectUri = $this->option('redirect-uri');
        if (filled($redirectUri)) {
            $client->setRedirectUri((string) $redirectUri);
        } else {
            $client->setRedirectUri('http://localhost');
        }

        return $this->exchangeCode($client, $code);
    }

    private function listenForAuthorizationCode(GoogleClient $client): int
    {
        $port = $this->findAvailablePort();
        $redirectUri = 'http://127.0.0.1:'.$port;
        $client->setRedirectUri($redirectUri);

        $authUrl = $client->createAuthUrl();

        $this->info('Listening on '.$redirectUri.' — open this URL in your browser:');
        $this->line($authUrl);
        $this->newLine();
        $this->warn('Sign in as: '.config('google.calendar_id'));
        $this->line('Waiting for Google to redirect back…');

        $socket = @stream_socket_server('tcp://127.0.0.1:'.$port, $errno, $errstr);
        if ($socket === false) {
            $this->error("Could not listen on port {$port}: {$errstr}");

            return self::FAILURE;
        }

        $code = null;
        $exitCode = self::FAILURE;
        $deadline = time() + 300;

        while (time() < $deadline && $code === null) {
            $conn = @stream_socket_accept($socket, 5);
            if ($conn === false) {
                continue;
            }

            $request = (string) stream_get_contents($conn);
            $parsedCode = $this->parseCodeFromHttpRequest($request);

            if (! filled($parsedCode)) {
                fclose($conn);

                continue;
            }

            $code = $parsedCode;
            $this->info('Authorization code received — exchanging for refresh token…');
            $exitCode = $this->exchangeCode($client, $code);

            $body = $exitCode === self::SUCCESS
                ? '<html><body><h2>Success</h2><p>Refresh token saved in terminal. Close this tab.</p></body></html>'
                : '<html><body><h2>Error</h2><p>Token exchange failed. Check the terminal.</p></body></html>';

            $response = "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nConnection: close\r\nContent-Length: ".strlen($body)."\r\n\r\n".$body;
            fwrite($conn, $response);
            fclose($conn);

            break;
        }

        fclose($socket);

        if (! filled($code)) {
            $this->error('Timed out waiting for authorization (5 minutes).');

            return self::FAILURE;
        }

        return $exitCode;
    }

    private function exchangeCode(GoogleClient $client, string $code): int
    {
        try {
            $token = $client->fetchAccessTokenWithAuthCode(trim($code));
        } catch (\Throwable $e) {
            $this->error('Token exchange failed: '.$e->getMessage());

            return self::FAILURE;
        }

        if (isset($token['error'])) {
            $error = (string) ($token['error'] ?? 'unknown');
            $this->error($token['error_description'] ?? $error);

            if ($error === 'invalid_grant') {
                $this->newLine();
                $this->warn('Code expired or already used.');
                $this->line('  php artisan google:calendar-oauth --listen');
            }

            return self::FAILURE;
        }

        $refresh = $token['refresh_token'] ?? null;
        if (! filled($refresh)) {
            $this->warn('No refresh_token returned.');
            $this->line('Revoke app access, then run --listen again:');
            $this->line('  https://myaccount.google.com/permissions');

            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Add to .env:');
        $this->line('GOOGLE_CALENDAR_REFRESH_TOKEN='.$refresh);
        $this->saveRefreshTokenToEnv($refresh);
        $this->newLine();
        $this->info('Then run: php artisan google:calendar-test');

        return self::SUCCESS;
    }

    private function saveRefreshTokenToEnv(string $refresh): void
    {
        $envPath = base_path('.env');
        if (! file_exists($envPath)) {
            return;
        }

        $contents = (string) file_get_contents($envPath);
        $line = 'GOOGLE_CALENDAR_REFRESH_TOKEN='.$refresh;

        if (preg_match('/^GOOGLE_CALENDAR_REFRESH_TOKEN=.*$/m', $contents)) {
            $contents = preg_replace('/^GOOGLE_CALENDAR_REFRESH_TOKEN=.*$/m', $line, $contents);
        } else {
            $contents = rtrim($contents)."\n".$line."\n";
        }

        file_put_contents($envPath, $contents);
        $this->info('Saved GOOGLE_CALENDAR_REFRESH_TOKEN to .env automatically.');
    }

    private function makeOAuthClient(string $oauthPath): GoogleClient
    {
        $client = new GoogleClient;
        $client->setAuthConfig($oauthPath);
        $client->setScopes([Calendar::CALENDAR_EVENTS]);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        return $client;
    }

    private function printManualInstructions(GoogleClient $client): void
    {
        $client->setRedirectUri('http://localhost');
        $this->info('Recommended (automatic):');
        $this->line('  php artisan google:calendar-oauth --listen');
        $this->newLine();
        $this->info('Manual: open this URL, then paste the code from the address bar:');
        $this->line($client->createAuthUrl());
        $this->newLine();
        $this->line('  php artisan google:calendar-oauth "PASTE_CODE" --redirect-uri=http://127.0.0.1:8095');
    }

    private function parseCodeFromHttpRequest(string $request): ?string
    {
        if (! preg_match('#GET\s+([^\s]+)\s+#', $request, $matches)) {
            return null;
        }

        $path = $matches[1];
        parse_str(parse_url($path, PHP_URL_QUERY) ?? '', $query);

        $code = $query['code'] ?? null;

        return is_string($code) && $code !== '' ? $code : null;
    }

    private function findAvailablePort(): int
    {
        foreach ([8095, 8096, 8097, 8098] as $port) {
            $socket = @stream_socket_server('tcp://127.0.0.1:'.$port, $errno, $errstr);
            if ($socket !== false) {
                fclose($socket);

                return $port;
            }
        }

        return 8095;
    }

    private function missingOAuthClient(?string $oauthPath): int
    {
        $projectId = $this->resolveGcpProjectId();

        $this->error('OAuth client JSON missing: '.$oauthPath);
        $this->newLine();
        $this->info('Download OAuth Desktop client JSON to:');
        $this->line('  '.$oauthPath);
        $this->line('  https://console.cloud.google.com/apis/credentials?project='.$projectId);

        return self::FAILURE;
    }

    private function resolveGcpProjectId(): string
    {
        $path = config('google.credentials_path');
        if (! is_string($path) || ! file_exists($path)) {
            return 'hypnotic-bounty-496623-r1';
        }

        $json = json_decode((string) file_get_contents($path), true);

        return is_array($json) ? (string) ($json['project_id'] ?? 'hypnotic-bounty-496623-r1') : 'hypnotic-bounty-496623-r1';
    }
}
