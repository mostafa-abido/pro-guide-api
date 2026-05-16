import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useSpring, useTransform } from 'motion/react';
import { getStats } from '@/lib/api';

function AnimatedNumber({ value }: { value: string }) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const spring = useSpring(0, { duration: 2500 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function Stats() {
  const { t, i18n } = useTranslation();
  const [statsData, setStatsData] = useState<any[]>([]);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    // جلب البيانات من الـ API (الداشبورد)
    getStats()
      .then((res) => {
        // تأكد من مسار البيانات حسب هيكلة الـ API الخاصة بك
        const data = res.data?.data || res.data || [];
        setStatsData(data);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #03C0EC, #0359E8)' }}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* الموجة العلوية */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[-1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,202-33.31,87.35,0,165.74,47.34,252,47.34,84.58,0,157.39-38.6,243.64-38.6,63.15,0,126.33,18.9,188.75,21,114.7,3.92,238.43-15.6,355.67-46.61V0Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
          {statsData.map((stat, index) => {
            /**
             * منطق عرض النص:
             * 1. إذا كانت اللغة الحالية هي العربية، نأخذ النص من الداشبورد (stat.label) أولاً.
             * 2. إذا كانت لغة أخرى (EN/DE)، نبحث عن الترجمة في ملف i18n، وإذا لم نجدها نعود لنص الداشبورد.
             */
            const displayLabel = isAr 
              ? (stat.label || t(`stats.items.${index}.label`)) 
              : t(`stats.items.${index}.label`, { defaultValue: stat.label });

            return (
              <div key={index} className="flex flex-col items-center">
                <span className="text-[64px] md:text-[80px] font-bold mb-4 tracking-tighter">
                  {/* القيمة تأتي دائماً من الداشبورد */}
                  <AnimatedNumber value={String(stat.value)} />
                  <span className="text-4xl ml-1">
                    {String(stat.value).replace(/[0-9]/g, '')}
                  </span>
                </span>
                <p className="text-white/90 text-lg leading-relaxed max-w-[280px]">
                  {displayLabel}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* الموجة السفلية */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,202-33.31,87.35,0,165.74,47.34,252,47.34,84.58,0,157.39-38.6,243.64-38.6,63.15,0,126.33,18.9,188.75,21,114.7,3.92,238.43-15.6,355.67-46.61V0Z"></path>
        </svg>
      </div>
    </section>
  );
}