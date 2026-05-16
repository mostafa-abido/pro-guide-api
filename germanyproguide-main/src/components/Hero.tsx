import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { getHomepageData } from '@/lib/api';
import { assetUrl } from '@/lib/assetUrl'; 

export default function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  const { t, i18n } = useTranslation();
  const [heroData, setHeroData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. جلب البيانات من السيرفر عند تحميل المكون أو تغيير اللغة
  useEffect(() => {
    setIsLoading(true);
    getHomepageData()
      .then((res) => {
        // البحث عن قسم الهيرو بناءً على مفتاح 'hero' (مثل herooooo في لوحة التحكم)
        const sections = res.data?.data?.sections || res.data?.sections || [];
        const section = sections.find((s: any) =>
          s.key?.toLowerCase().includes('hero')
        );
        setHeroData(section || null);
      })
      .catch((err) => console.error("Error fetching hero data:", err))
      .finally(() => setIsLoading(false));
  }, [i18n.language]); // التغيير هنا يضمن تحديث البيانات للغات الثلاث

  const isAr = i18n.language === 'ar';

  // 2. دالة استخراج القيم من مصفوفة الـ payload المرنة
  const getPayloadValue = (key: string) => {
    if (heroData?.payload && Array.isArray(heroData.payload)) {
      const item = heroData.payload.find((p: any) => p.key === key);
      return item ? item.value : null;
    }
    return null;
  };

  // 3. إعداد النصوص مع دعم اللغات الثلاث (السيرفر أولاً ثم ملف i18n.ts المحلي)
// جرب تغيير هذه السطور لاختبار الترجمة المحلية
// ✅ هذا الكود يبحث في الداشبورد أولاً، وإذا لم يجد (أو كانت اللغة غير مدعومة في السيرفر) يأخذ من i18n.ts
const displayTitle = isAr ? (heroData?.title || t('hero.title')) : t('hero.title');
const displaySubtitle = isAr ? (heroData?.subtitle || t('hero.description')) : t('hero.description');
const displayCta = isAr ? (getPayloadValue('cta_text') || t('hero.cta')) : t('hero.cta');
  const videoSrc = heroData?.image_url || assetUrl('hero.mp4');

  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 🎥 الخلفية: فيديو ديناميكي */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video 
          key={videoSrc + i18n.language} // المفتاح يضمن إعادة تحميل الفيديو عند تغيير اللغة
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* الطبقة الداكنة (Navy Overlay) لضمان مقروئية النص */}
        <div className="absolute inset-0 bg-black/45 z-10"></div>
      </div>

      {/* ✨ المحتوى النصي */}
      <div className="container mx-auto px-6 relative z-20 text-center text-white">
        <div className="max-w-[900px] mx-auto">
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.div
                key={i18n.language} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* العنوان الكبير */}
                <h1 className="text-[32px] md:text-[64px] font-bold leading-[1.2] mb-6 bg-gradient-to-r from-white via-[#9EC5FF] to-[#3B82F6] bg-clip-text text-transparent">
                  {displayTitle}
                </h1>

                {/* الوصف */}
                <p className="text-[17px] md:text-[20px] text-white/90 leading-[1.8] mb-10 max-w-[700px] mx-auto font-medium">
                  {displaySubtitle}
                </p>

                {/* زر الإجراء (CTA) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={onCtaClick}
                    className="bg-[#0359E8] hover:bg-blue-700 text-white px-10 py-7 text-[18px] rounded-xl shadow-xl font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    {displayCta}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* مؤشر النزول للأسفل */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto"></div>
      </motion.div>
    </section>
  );
}