import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Youtube, Globe } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const langs = ['ar', 'en', 'de'];

  const toggleLanguage = () => {
    const currentIndex = langs.indexOf(currentLang);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextLang = langs[(safeIndex + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  const isRTL = currentLang === 'ar';

  return (
    <footer
      className="text-white py-12"
      style={{
        background: 'linear-gradient(to bottom, #03C0EC, #0359E8)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center gap-8">

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-lg font-medium text-center">
          <a href="#about" className="hover:text-white/70 transition-colors">{t('nav.about')}</a>
          <a href="#services" className="hover:text-white/70 transition-colors">{t('nav.services')}</a>
          <a href="#booking" className="hover:text-white/70 transition-colors">{t('nav.consultations')}</a>
          <a href="#contact" className="hover:text-white/70 transition-colors">{t('nav.contact')}</a>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:text-white/70 transition-colors border border-white/30 px-4 py-1 rounded-full text-sm uppercase"
          >
            <Globe className="w-4 h-4" />
            {currentLang.toUpperCase()}
          </button>
        </nav>

        {/* Social */}
        <div className="flex gap-6">
          <a href="#" aria-label="Facebook" className="hover:scale-110 transition-transform">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:scale-110 transition-transform">
            <Twitter className="w-6 h-6" />
          </a>
          <a href="#" aria-label="YouTube" className="hover:scale-110 transition-transform">
            <Youtube className="w-6 h-6" />
          </a>
        </div>

        {/* Footer text */}
        <div className="text-center text-white/80 text-sm max-w-3xl leading-relaxed">
          <p>{t('footer.rights')}</p>
        </div>

        

      </div>
    </footer>
  );
}