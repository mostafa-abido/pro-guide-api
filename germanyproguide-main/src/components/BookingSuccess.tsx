import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { confirmBookingCheckout, handleApiError } from '@/lib/api';

type Props = {
  sessionId: string;
  onDone: () => void;
};

export default function BookingSuccess({ sessionId, onDone }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [booking, setBooking] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const response = await confirmBookingCheckout(sessionId);
        setBooking(response.data?.data);
        setStatus('success');
      } catch (err) {
        const apiError = handleApiError(err) as { message?: string };
        setErrorMessage(apiError?.message || t('booking.paymentFailed'));
        setStatus('error');
      }
    };

    run();
  }, [sessionId, t]);

  return (
    <motion.div
      className="min-h-[60vh] flex items-center justify-center px-4 py-20"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-14 h-14 text-[#0359E8] animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">
              {t('booking.confirmingPayment')}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {t('booking.paymentSuccessTitle')}
            </h1>
            <p className="text-slate-600 mb-6">
              {t('booking.paymentSuccessMessage')}
            </p>
            {booking?.slot && (
              <div className="bg-[#F3F7FF] rounded-2xl p-4 text-sm text-slate-700 mb-6">
                <p className="font-bold">{booking.full_name}</p>
                <p>{booking.slot.date} — {booking.slot.time}</p>
                <p>
                  {booking.slot.price?.amount} {booking.slot.price?.currency}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={onDone}
              className="w-full bg-[#0359E8] text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t('booking.backToSlots')}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {t('booking.paymentFailedTitle')}
            </h1>
            <p className="text-slate-600 mb-6">{errorMessage}</p>
            <button
              type="button"
              onClick={onDone}
              className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors"
            >
              {t('booking.tryAgain')}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
