import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { getAvailability } from '@/lib/api';
import { assetUrl } from '@/lib/assetUrl';

const bgVideo = assetUrl('hero.mp4'); 

export default function Booking() {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [view, setView] = useState<'time' | 'date'>('time');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // تحديد اللغة الحالية والاتجاه
  const currentLang = i18n.language;
  const isAr = currentLang === 'ar';
  const isEn = currentLang === 'en';
  const isDe = currentLang === 'de';

useEffect(() => {
  const fetchSlots = async () => {
    setIsLoading(true);

    try {
      const response = await getAvailability();

      // 👇 هنا المكان الصح
      console.log("API RESPONSE:", response.data);
      const data =
        response.data?.data ||
        response.data?.slots ||
        response.data ||
        [];

      setTimeSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching slots:", err);
      setTimeSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchSlots();
}, []);

  // دالة لتنسيق التاريخ حسب اللغة المختارة
  const formatDate = (dateString: string) => {
    const locale = isAr ? 'ar-EG' : isDe ? 'de-DE' : 'en-GB';





  console.log("TIME SLOTS:", timeSlots);




    return new Date(dateString).toLocaleDateString(locale, { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[1px]"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 text-center text-white max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('booking.title', 'احجز الميعاد المناسب لك الآن')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
            {t('booking.description', 'ابدأ الآن في التخطيط لمستقبلك في ألمانيا! احجز استشارة شخصية مع خبرائنا.')}
          </p>
        </motion.div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="container mx-auto px-4 max-w-7xl mt-12">
        
        {/* Header with Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-slate-100 pb-6 gap-6">
          <h2 className="text-3xl font-bold text-[#0359E8]">
            {t('booking.availableSlots', 'المواعيد المتاحة')}
          </h2>

          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setView('time')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all",
                view === 'time' ? "bg-white shadow-sm text-[#0359E8]" : "text-slate-500"
              )}
            >
              <Clock className="w-4 h-4" />
              {t('booking.time', 'الوقت')}
            </button>
            <button
              onClick={() => setView('date')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all",
                view === 'date' ? "bg-white shadow-sm text-[#0359E8]" : "text-slate-500"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              {t('booking.date', 'التاريخ')}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'date' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <Card className="rounded-3xl shadow-xl border-slate-100 p-4">
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    className="w-full"
                    // لضمان عمل الكالندر بلغات مختلفة إذا كانت تدعم الـ Locale
                    onSelect={(d) => { if (d) { setDate(d); setView('time'); } }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="time"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {isLoading ? (
                <div className="col-span-full text-center py-20 text-slate-400 font-medium italic">
                  {t('booking.loading', 'جاري تحميل المواعيد...')}
                </div>
              ) : timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.is_booked}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={cn(
                      "relative group p-6 rounded-xl border transition-all duration-300 text-center",
                      slot.is_booked
                        ? "bg-[#6B7280] border-slate-300 cursor-not-allowed"
                        : selectedSlot === slot.id
                        ? "bg-[#0359E8] text-white border-[#0359E8] shadow-lg"
                        : "bg-[#F3F7FF] border-[#D1E0FF] hover:border-[#0359E8] hover:bg-white"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Clock className={cn("w-5 h-5 mb-1", 
                        slot.is_booked ? "text-slate-300" : selectedSlot === slot.id ? "text-white" : "text-[#0359E8]"
                      )} />
                      
                      <span className={cn("text-sm font-bold opacity-80", 
                        slot.is_booked ? "text-white" : selectedSlot === slot.id ? "text-white" : "text-slate-600"
                      )}>
                        {formatDate(slot.date)}
                      </span>
                      
                      <span className={cn("text-lg font-black", 
                        slot.is_booked ? "text-white" : selectedSlot === slot.id ? "text-white" : "text-[#0359E8]"
                      )}>
                        {slot.time?.substring(0, 5)} {isAr ? 'مساًء' : 'PM'}
                      </span>

                      <span
  className={cn(
    "text-xl font-black mt-1",
    slot.is_booked
      ? "text-white"
      : selectedSlot === slot.id
      ? "text-white"
      : "text-slate-800"
  )}
>
  {slot.price?.amount ?? "30"} {slot.price?.currency ?? "€"}
</span>

                      <span className={cn("text-[10px] font-bold mt-1", 
                        slot.is_booked ? "text-white/70" : selectedSlot === slot.id ? "text-white/80" : "text-slate-400"
                      )}>
                        {t('booking.duration', 'لمدة 30 دقيقة')}
                      </span>
                    </div>

                    {slot.is_booked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
                        <div className="bg-[#0359E8] text-white text-xs font-black px-4 py-2 shadow-xl transform -rotate-12 border-2 border-white scale-125">
                          {t('booking.booked', 'محجوز')}
                        </div>
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold">{t('booking.noSlots', 'لا توجد مواعيد متاحة')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}