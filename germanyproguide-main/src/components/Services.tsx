import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { getServices } from '@/lib/api';
import { assetUrl } from '@/lib/assetUrl';

export default function Services({ onCtaClick }: { onCtaClick: () => void }) {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    // نطلب 50 عنصر لضمان جلب الـ 6 خدمات كاملة من السيرفر
    getServices(true, 50)
      .then((res) => {
        setServices(res.data.data || []);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  return (
    <section 
      id="services" 
      className="py-24 bg-white" 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            key={i18n.language}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-[#0359E8] mb-4">
              {t('services.title')}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 justify-center">
          <AnimatePresence mode="wait">
            {services.map((service, index) => {
              // منطق الترجمة الهجين
              const displayTitle = isAr 
                ? service.title 
                : t(`services.items.${index}.title`, { defaultValue: service.title });

              const localFeatures = t(`services.items.${index}.features`, { returnObjects: true });
              const displayFeatures = (isAr || !Array.isArray(localFeatures))
                ? service.features
                : localFeatures;

              return (
                <motion.div
                  key={`${service.id}-${i18n.language}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-center"
                >
                  <Card className="w-full max-w-[416px] min-h-[550px] border border-slate-100/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[20px] overflow-hidden text-start flex flex-col">
                    
                    <div className="h-[218px] overflow-hidden rounded-t-[20px]">
                     <img
  src={service.image_url || (() => {
    // تحديد الصورة بناءً على الكلمات المفتاحية في العنوان
    const title = service.title.toLowerCase();
    if (title.includes('عمل') || title.includes('job') || title.includes('arbeit')) return assetUrl('serv1.png');
    if (title.includes('تدريب') || title.includes('training') || title.includes('ausbildung')) return assetUrl('serv2.png');
    if (title.includes('دراسة') || title.includes('study') || title.includes('studium')) return assetUrl('serv3.png');
    if (title.includes('تأشيرة') || title.includes('visa')) return assetUrl('serv4.png');
    return assetUrl(`serv${index + 1}.png`);
  })()} 
  alt={displayTitle}
  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
  onError={(e) => {
    // حل أخير إذا فشل كل ما سبق: اجعلها serv1.png
    (e.target as HTMLImageElement).src = assetUrl('serv1.png');
  }}
/>
                    </div>

                    <CardHeader className="pb-3 pt-8 px-8">
                      <CardTitle className="text-xl md:text-2xl text-[#0359E8] font-bold leading-tight">
                        {displayTitle}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 pb-8 flex-grow">
                      <div className="text-sm font-bold text-slate-400 mb-5 flex items-center gap-2">
                        <span className="w-1 h-4 bg-[#0359E8] rounded-full inline-block"></span>
                        {t('nav.services')}
                      </div>

                      <ul className="space-y-4">
                        {displayFeatures?.map((feat: any, i: number) => (
                          <li key={i} className="flex items-start gap-3.5 text-slate-700 text-[15px] font-medium leading-relaxed">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#0359E8] shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </span>
                            <span>
                              {typeof feat === 'string' ? feat : (feat.text || feat.name || "Feature")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* CTA Button */}
        <div className="mt-20 text-center">
          <Button 
            size="lg" 
            onClick={onCtaClick} 
            className="bg-[#0359E8] hover:bg-blue-700 text-white px-12 py-7 text-lg rounded-xl shadow-lg transition-all font-bold"
          >
            {t('hero.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}