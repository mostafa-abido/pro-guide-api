import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format, isSameDay, startOfDay } from 'date-fns';
import { ar, de, enGB } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { createBookingCheckout, getAvailability, handleApiError } from '@/lib/api';
import { assetUrl } from '@/lib/assetUrl';

const bgVideo = assetUrl('hero.mp4');

type Slot = {
  id: number;
  date: string;
  time: string;
  duration_minutes?: number;
  price?: { amount: number; currency: string };
  is_booked: boolean;
};

function slotDateKey(dateStr: string): string {
  return dateStr.substring(0, 10);
}

export default function Booking() {
  const { t, i18n } = useTranslation();
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [view, setView] = useState<'time' | 'date'>('time');
  const [timeSlots, setTimeSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const lang = i18n.language?.split('-')[0] || 'ar';
  const isAr = lang === 'ar';
  const isDe = lang === 'de';
  const dateLocale = isAr ? ar : isDe ? de : enGB;
  const timeLocale = isAr ? 'ar-EG' : isDe ? 'de-DE' : 'en-GB';

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);
      try {
        const response = await getAvailability();
        const data =
          response.data?.data ||
          response.data?.slots ||
          response.data ||
          [];
        setTimeSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const availableSlots = useMemo(
    () => timeSlots.filter((s) => !s.is_booked),
    [timeSlots]
  );

  const datesWithSlots = useMemo(() => {
    const keys = new Set(availableSlots.map((s) => slotDateKey(s.date)));
    return Array.from(keys).map((key) => new Date(`${key}T12:00:00`));
  }, [availableSlots]);

  const filteredSlots = useMemo(() => {
    if (!filterDate) {
      return availableSlots;
    }
    return availableSlots.filter((s) =>
      isSameDay(new Date(`${slotDateKey(s.date)}T12:00:00`), filterDate)
    );
  }, [availableSlots, filterDate]);

  const selectedSlotData = filteredSlots.find((s) => s.id === selectedSlot)
    ?? availableSlots.find((s) => s.id === selectedSlot);

  useEffect(() => {
    if (selectedSlot && !filteredSlots.some((s) => s.id === selectedSlot)) {
      setSelectedSlot(null);
    }
  }, [filteredSlots, selectedSlot]);

  const formatDateLabel = (dateString: string) =>
    format(new Date(`${slotDateKey(dateString)}T12:00:00`), 'd MMM yyyy', {
      locale: dateLocale,
    });

  const formatTimeLabel = (timeStr: string) => {
    const [h, m] = timeStr.substring(0, 5).split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toLocaleTimeString(timeLocale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: !isDe,
    });
  };

  const handlePay = async () => {
    if (!selectedSlot) return;
    setCheckoutError('');
    setIsPaying(true);
    try {
      const response = await createBookingCheckout({
        appointment_slot_id: selectedSlot,
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });
      const url = response.data?.data?.checkout_url;
      if (!url) {
        setCheckoutError(t('booking.checkoutError'));
        return;
      }
      window.location.href = url;
    } catch (err) {
      const apiError = handleApiError(err) as { message?: string };
      setCheckoutError(apiError?.message || t('booking.checkoutError'));
    } finally {
      setIsPaying(false);
    }
  };

  const handleCalendarSelect = (d: Date | undefined) => {
    if (!d) return;
    setFilterDate(d);
    setView('time');
    setSelectedSlot(null);
    setCheckoutError('');
  };

  const clearDateFilter = () => {
    setFilterDate(undefined);
    setSelectedSlot(null);
  };

  return (
    <motion.div className="min-h-screen bg-white pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <motion.div className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <motion.div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[1px]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-6 text-center text-white max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('booking.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
            {t('booking.description')}
          </p>
        </motion.div>
      </motion.div>

      <motion.div className="container mx-auto px-4 max-w-7xl mt-12">
        <motion.div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-100 pb-6 gap-6">
          <h2 className="text-3xl font-bold text-[#0359E8]">{t('booking.availableSlots')}</h2>
          <motion.div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setView('time')}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all',
                view === 'time' ? 'bg-white shadow-sm text-[#0359E8]' : 'text-slate-500'
              )}
            >
              <Clock className="w-4 h-4" />
              {t('booking.time')}
            </button>
            <button
              type="button"
              onClick={() => setView('date')}
              className={cn(
                'flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all',
                view === 'date' ? 'bg-white shadow-sm text-[#0359E8]' : 'text-slate-500'
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              {t('booking.date')}
            </button>
          </motion.div>
        </motion.div>

        {view === 'time' && filterDate && (
          <motion.div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-sm font-bold text-slate-600 bg-[#F3F7FF] border border-[#D1E0FF] px-4 py-2 rounded-full">
              {t('booking.slotsOnDate', { date: format(filterDate, 'd MMM yyyy', { locale: dateLocale }) })}
            </span>
            <button
              type="button"
              onClick={clearDateFilter}
              className="flex items-center gap-1 text-sm font-bold text-[#0359E8] hover:underline"
            >
              <X className="w-4 h-4" />
              {t('booking.clearDateFilter')}
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {view === 'date' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <p className="text-center text-sm text-slate-500 mb-4 font-medium">
                {t('booking.pickDateHint')}
              </p>
              <Card className="rounded-3xl shadow-xl border-slate-100 p-4">
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    locale={dateLocale}
                    onSelect={handleCalendarSelect}
                    disabled={(day) => day < startOfDay(new Date())}
                    modifiers={{
                      hasSlots: (day) =>
                        datesWithSlots.some((d) => isSameDay(d, day)),
                    }}
                    modifiersClassNames={{
                      hasSlots:
                        'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-[#0359E8]',
                    }}
                    className="w-full"
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
                <motion.div className="col-span-full text-center py-20 text-slate-400 font-medium italic">
                  {t('booking.loading')}
                </motion.div>
              ) : filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.is_booked}
                    onClick={() => {
                      setSelectedSlot(slot.id);
                      setCheckoutError('');
                    }}
                    className={cn(
                      'relative group p-6 rounded-xl border transition-all duration-300 text-center',
                      slot.is_booked
                        ? 'bg-[#6B7280] border-slate-300 cursor-not-allowed'
                        : selectedSlot === slot.id
                          ? 'bg-[#0359E8] text-white border-[#0359E8] shadow-lg'
                          : 'bg-[#F3F7FF] border-[#D1E0FF] hover:border-[#0359E8] hover:bg-white'
                    )}
                  >
                    <motion.div className="flex flex-col items-center gap-1">
                      <Clock
                        className={cn(
                          'w-5 h-5 mb-1',
                          slot.is_booked
                            ? 'text-slate-300'
                            : selectedSlot === slot.id
                              ? 'text-white'
                              : 'text-[#0359E8]'
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-bold opacity-80',
                          slot.is_booked
                            ? 'text-white'
                            : selectedSlot === slot.id
                              ? 'text-white'
                              : 'text-slate-600'
                        )}
                      >
                        {formatDateLabel(slot.date)}
                      </span>
                      <span
                        className={cn(
                          'text-lg font-black',
                          slot.is_booked
                            ? 'text-white'
                            : selectedSlot === slot.id
                              ? 'text-white'
                              : 'text-[#0359E8]'
                        )}
                      >
                        {formatTimeLabel(slot.time)}
                      </span>
                      <span
                        className={cn(
                          'text-xl font-black mt-1',
                          slot.is_booked
                            ? 'text-white'
                            : selectedSlot === slot.id
                              ? 'text-white'
                              : 'text-slate-800'
                        )}
                      >
                        {slot.price?.amount ?? '—'} {slot.price?.currency ?? 'EUR'}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-bold mt-1',
                          slot.is_booked
                            ? 'text-white/70'
                            : selectedSlot === slot.id
                              ? 'text-white/80'
                              : 'text-slate-400'
                        )}
                      >
                        {t('booking.durationMinutes', {
                          minutes: slot.duration_minutes ?? 30,
                        })}
                      </span>
                    </motion.div>
                    {slot.is_booked && (
                      <motion.div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
                        <motion.div className="bg-[#0359E8] text-white text-xs font-black px-4 py-2 shadow-xl transform -rotate-12 border-2 border-white scale-125">
                          {t('booking.booked')}
                        </motion.div>
                      </motion.div>
                    )}
                  </button>
                ))
              ) : (
                <motion.div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold">
                    {filterDate ? t('booking.noSlotsForDate') : t('booking.noSlots')}
                  </p>
                  {filterDate && (
                    <button
                      type="button"
                      onClick={clearDateFilter}
                      className="mt-4 text-[#0359E8] font-bold text-sm hover:underline"
                    >
                      {t('booking.clearDateFilter')}
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedSlot && selectedSlotData && !selectedSlotData.is_booked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 max-w-xl mx-auto bg-[#F3F7FF] border border-[#D1E0FF] rounded-3xl p-8 shadow-lg"
          >
            <h3 className="text-xl font-bold text-[#0359E8] mb-2">{t('booking.checkoutTitle')}</h3>
            <p className="text-sm text-slate-600 mb-6">
              {formatDateLabel(selectedSlotData.date)} — {formatTimeLabel(selectedSlotData.time)} ·{' '}
              {selectedSlotData.price?.amount} {selectedSlotData.price?.currency}
            </p>
            <motion.div className="space-y-4">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('booking.fullName')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0359E8]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('booking.email')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0359E8]"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('booking.phone')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0359E8]"
              />
              {checkoutError && (
                <p className="text-sm text-red-600 font-medium">{checkoutError}</p>
              )}
              <button
                type="button"
                disabled={isPaying || !fullName.trim() || !email.trim()}
                onClick={handlePay}
                className="w-full bg-[#0359E8] text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPaying ? t('booking.redirecting') : t('booking.payWithStripe')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
