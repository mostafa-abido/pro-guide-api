import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../../public/logo.png';

export default function Header({ onPageChange }: { onPageChange: (page: 'home' | 'booking') => void }) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  
  const isAr = i18n.language === 'ar';

  // إغلاق قائمة اللغات عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    setIsLangOpen(false);
    setIsMenuOpen(false); // إغلاق القائمة الجانبية عند تغيير اللغة
  };

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'German' }, // تحديث المسمى إلى German
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const rightNav = [
    { label: t('nav.about', 'من نحن'), action: () => scrollToSection('about') },
    { label: t('nav.services', 'خدماتنا'), action: () => scrollToSection('services') },
  ];

  const leftNav = [
    { label: t('nav.consultations', 'استشارات'), action: () => onPageChange('booking') },
    { label: t('nav.contact', 'تواصل معنا'), action: () => scrollToSection('contact') },
  ];

  const allNavItems = [...rightNav, ...leftNav];

  return (
    <header className="fixed top-0 left-0 w-full z-50 h-[100px]">
      <div className="h-[100px] flex items-center justify-between px-6 md:px-12 text-white bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4),rgba(0,0,0,0))] backdrop-blur-[42px] border-b border-[#0359E8]/40">
        
        {/* Desktop Navigation - Right Side */}
        <nav className="hidden md:flex flex-1 justify-end items-center gap-10 text-[15px] font-medium order-1">
          {rightNav.map((item, i) => (
            <button key={i} onClick={item.action} className="hover:text-[#3B82F6] transition">
              {item.label}
            </button>
          ))}
        </nav>

        {/* LOGO - Center */}
        <div className="flex justify-center items-center px-6 cursor-pointer order-2" onClick={() => onPageChange('home')}>
          <img src={logo} alt="logo" className="h-[50px]" />
        </div>

        {/* Desktop Navigation - Left Side */}
        <nav className="hidden md:flex flex-1 justify-start items-center gap-10 text-[15px] font-medium order-3">
          {leftNav.map((item, i) => (
            <button key={i} onClick={item.action} className="hover:text-[#3B82F6] transition">
              {item.label}
            </button>
          ))}

          {/* Language Dropdown Desktop */}
          <div className="relative" ref={langMenuRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="text-white hover:bg-white/10"
            >
              <Globe className="w-5 h-5" />
            </Button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  key="lang-dropdown-desktop"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} bg-[#020817] border border-[#0359E8]/30 rounded-xl overflow-hidden min-w-[140px] shadow-2xl backdrop-blur-xl`}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-3 text-sm flex items-center justify-between hover:bg-[#0359E8]/20 transition-colors ${i18n.language === lang.code ? 'text-[#3B82F6]' : 'text-white/80'}`}
                    >
                      {lang.label}
                      {i18n.language === lang.code && <Check size={14} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white z-[60]">
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div key="mobile-nav-container" className="fixed inset-0 z-50">
            {/* Backdrop */}
            <motion.div 
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-[#020817]/60 backdrop-blur-md"
            />

            {/* Sidebar Content */}
            <motion.div
              key="mobile-sidebar"
              initial={{ x: isAr ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isAr ? 'right-0' : 'left-0'} w-[80%] max-w-[300px] h-full shadow-2xl border-x border-[#0359E8]/20 p-8 pt-24 flex flex-col bg-gradient-to-b from-[#020817] via-[#010b24] to-[#0359E8]/10 backdrop-blur-2xl`}
            >
              <div className="flex flex-col gap-6">
                {allNavItems.map((item, i) => (
                  <motion.button
                    key={`nav-item-${i}`}
                    initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={item.action}
                    className={`flex items-center justify-between w-full text-[18px] font-semibold text-white/90 border-b border-[#0359E8]/10 pb-4 hover:text-[#3B82F6] hover:border-[#3B82F6]/40 transition-all group ${isAr ? 'text-right' : 'text-left'}`}
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-[5px] rtl:group-hover:translate-x-[-5px]">
                      {item.label}
                    </span>
                    {isAr ? (
                      <ChevronLeft size={20} className="text-[#0359E8] opacity-70" />
                    ) : (
                      <ChevronRight size={20} className="text-[#0359E8] opacity-70" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Language Selection Section for Mobile */}
              <div className="mt-10">
                <p className="text-[12px] text-[#0359E8] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe size={14} /> {isAr ? 'اختر اللغة' : 'Select Language'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {languages.map((lang, idx) => (
                    <motion.button
                      key={lang.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      onClick={() => changeLanguage(lang.code)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                        i18n.language === lang.code 
                        ? 'bg-[#0359E8]/20 border-[#0359E8]' 
                        : 'bg-white/5 border-white/10'
                      } text-white transition-all`}
                    >
                      <span className="text-sm font-medium">{lang.label}</span>
                      {i18n.language === lang.code && <Check size={16} className="text-[#3B82F6]" />}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pb-10 text-center">
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#0359E8]/40 to-transparent mb-6"></div>
                <img src={logo} alt="logo" className="h-10 mx-auto opacity-80" />
                <p className="text-[10px] text-white/30 mt-4 tracking-widest uppercase">
                  Germany Pro Guide
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}