import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import aboutImageSrc from '../assets/about.png';
import { getHomepageData } from '@/lib/api';

export default function About({ onCtaClick }: { onCtaClick: () => void }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const isAr = i18n.language === 'ar'; // التأكد من أن اللغة الحالية هي العربية

  const [aboutData, setAboutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getHomepageData()
      .then((res) => {
        const sections = res.data?.data?.sections || res.data?.sections || [];
        const section = sections.find(
          (s: any) => s.key?.toLowerCase() === 'about'
        );
        setAboutData(section || null);
      })
      .catch((err) => console.error("Error fetching about data:", err))
      .finally(() => setIsLoading(false));
  }, [i18n.language]);

  // دالة لاستخراج القيم من الـ payload (مثل نص الزر)
  const getPayloadValue = (key: string) => {
    if (aboutData?.payload && Array.isArray(aboutData.payload)) {
      const item = aboutData.payload.find((p: any) => p.key === key);
      return item ? item.value : null;
    }
    return null;
  };

  /**
   * منطق عرض النصوص:
   * إذا كانت اللغة عربية: نأخذ من الداشبورد (aboutData) أولاً، ثم ملف الترجمة كاحتياط.
   * إذا كانت لغة أخرى: نأخذ من ملف الترجمة (t) مباشرة.
   */
  const displayTitle = isAr ? (aboutData?.title || t('about.title')) : t('about.title');
  const displayDescription = isAr ? (aboutData?.subtitle || t('about.description')) : t('about.description');
  // ملاحظة: إذا كان هناك حقل إضافي للمهمة (mission) في الداشبورد، يمكنك استخدامه هنا بنفس الطريقة.
  const displayMission = isAr ? (getPayloadValue('mission_text') || t('about.mission')) : t('about.mission');
  const displayCta = isAr ? (getPayloadValue('cta_text') || t('about.cta')) : t('about.cta');

  return (
    <section id="about" className="py-24 bg-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col-reverse lg:flex-row-reverse items-center gap-20">
          
          {/* 🖼️ الصورة (تأخذ من الداشبورد أو الصورة المحلية) */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 w-full max-w-3xl"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
              <img
                src={aboutData?.image_url || aboutImageSrc}
                alt="About"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* 📝 النصوص */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 space-y-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={i18n.language}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* العنوان */}
                <h2 className="text-4xl md:text-4xl font-bold leading-tight text-center lg:text-start bg-gradient-to-r from-black to-[#0359E8] bg-clip-text text-transparent">
                  {displayTitle}
                </h2>
                
                <div className="space-y-8 text-[#414141] leading-relaxed text-lg text-justify lg:text-start">
                  {/* الوصف الأول */}
                  <p>
                    {displayDescription}
                  </p>

                  {/* وصف المهمة */}
                  <p>
                    {displayMission}
                  </p>
                </div>
                
                {/* زر الأكشن */}
                <div className="flex justify-center lg:justify-start">
                  <Button
                    size="lg"
                    onClick={onCtaClick}
                    className="bg-[#0359E8] hover:bg-blue-700 text-white px-10 py-7 rounded-xl shadow-lg transition-all text-xl font-medium"
                  >
                    {displayCta}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}