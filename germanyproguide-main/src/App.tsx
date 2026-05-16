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
import './i18n';

export default function App() {
  const { i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState<'home' | 'booking'>('home');

  useEffect(() => {
    // Set initial direction based on language
    const currentLang = i18n.language || 'ar';
    document.documentElement.dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  const handleCtaClick = () => {
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-arabic selection:bg-brand-blue selection:text-white">
      <Header onPageChange={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-grow">
        {currentPage === 'home' ? (
          <>
            <Hero onCtaClick={handleCtaClick} />
            <About onCtaClick={handleCtaClick} />
            <Services onCtaClick={handleCtaClick} />
            <Stats />
            <Contact />
          </>
        ) : (
          <Booking />
        )}
      </main>

      <Footer />
    </div>
  );
}
