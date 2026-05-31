import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Booking from './components/Booking';
import BookingSuccess from './components/BookingSuccess';
import { motion } from 'motion/react';
import './i18n';

type Page = 'home' | 'booking' | 'booking-success';

function readUrlState(): { page: Page; sessionId: string | null; cancelled: boolean } {
  const params = new URLSearchParams(window.location.search);
  if (params.get('booking_success') === '1' && params.get('session_id')) {
    return { page: 'booking-success', sessionId: params.get('session_id'), cancelled: false };
  }
  if (params.get('booking_cancelled') === '1') {
    return { page: 'booking', sessionId: null, cancelled: true };
  }
  return { page: 'home', sessionId: null, cancelled: false };
}

function clearBookingQueryParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete('booking_success');
  url.searchParams.delete('session_id');
  url.searchParams.delete('booking_cancelled');
  window.history.replaceState({}, '', url.pathname + url.search);
}

export default function App() {
  const { t, i18n } = useTranslation();
  const initial = readUrlState();
  const [currentPage, setCurrentPage] = useState<Page>(initial.page);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(initial.sessionId);
  const [paymentCancelled, setPaymentCancelled] = useState(initial.cancelled);

  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  const handleCtaClick = () => {
    setCurrentPage('booking');
    setPaymentCancelled(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: 'home' | 'booking') => {
    clearBookingQueryParams();
    setCheckoutSessionId(null);
    setPaymentCancelled(false);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingDone = () => {
    clearBookingQueryParams();
    setCheckoutSessionId(null);
    setPaymentCancelled(false);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-arabic selection:bg-brand-blue selection:text-white">
      <Header onPageChange={handlePageChange} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero onCtaClick={handleCtaClick} />
            <About onCtaClick={handleCtaClick} />
            <Services onCtaClick={handleCtaClick} />
            <Stats />
            <Contact />
          </>
        )}

        {currentPage === 'booking' && (
          <>
            {paymentCancelled && (
              <motion.div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-center py-3 text-sm font-medium">
                {t('booking.paymentCancelled')}
              </motion.div>
            )}
            <Booking />
          </>
        )}

        {currentPage === 'booking-success' && checkoutSessionId && (
          <BookingSuccess sessionId={checkoutSessionId} onDone={handleBookingDone} />
        )}
      </main>

      <Footer />
    </div>
  );
}
