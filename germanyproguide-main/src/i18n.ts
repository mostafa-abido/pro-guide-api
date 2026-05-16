import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      nav: {
        about: 'من نحن',
        services: 'خدماتنا',
        consultations: 'استشارات',
        contact: 'تواصل معنا',
      },
      hero: {
        title: 'هل تفكر في السفر إلى ألمانيا؟',
        description: 'نقدم استشارات شاملة تهدف إلى تعزيز نجاحاتك وتوجيه المشرفين. نحن هنا لمساعدتك في الحصول على فرص عمل مميزة في ألمانيا.',
        cta: 'احجز استشارة الآن!',
      },
      about: {
        title: 'من نحن',
        description: 'نحن متخصصون في تقديم الاستشارات الشاملة للمصريين والعرب الراغبين في الانتقال إلى ألمانيا، سواء للعمل، الدراسة، أو التدريب المهني.',
        mission: 'مهمتنا هي تذليل كافة العقبات القانونية والإجرائية وتوفير الدعم اللازم لضمان نجاح استقرارك في المجتمع الألماني.',
        cta: 'تعرف على المزيد'
      },
      services: {
        title: 'خدماتنا - السفر إلى ألمانيا 🇩🇪',
        subtitle: 'نقدم استشارات وتنفيذاً كاملة لكل من يرغب بالسفر إلى ألمانيا للعمل، الدراسة، أو التدريب المهني.',
        items: [
          { title: 'العمل في ألمانيا', features: ['البحث عن فرص عمل مناسبة', 'تجهيز السيرة الذاتية (CV)', 'كتابة خطاب التغطية', 'مراجعة عقود العمل'] },
          { title: 'التدريب المهني (Ausbildung)', features: ['إيجاد فرص تدريب مهني', 'التوجيه حسب المؤهل', 'تجهيز أوراق التقديم', 'مراجعة العقود'] },
          { title: 'الدراسة في ألمانيا', features: ['استشارات دراسية', 'اختيار الجامعة', 'تجهيز أوراق التقديم', 'معادلة الشهادات'] },
          { title: 'البحث عن سكن', features: ['توفير خيارات سكنية', 'مراجعة عقود الإيجار', 'تأمين سكن مؤقت', 'نصائح عن المناطق'] },
          { title: 'الاعتراف بالشهادات', features: ['تقييم الشهادات الأجنبية', 'التواصل مع النقابات', 'ترجمة المستندات', 'متابعة إجراءات التعديل'] },
          { title: 'تأشيرات الفيزا', features: ['تجهيز ملف السفارة', 'حجز مواعيد المقابلة', 'تأمين صحي للسفر', 'التحضير للمقابلة الشخصية'] }
        ]
      },
      stats: {
        items: [
          { label: 'استشارة مقدمة' },
          { label: 'عملية توظيف ناجحة' },
          { label: 'سنوات من الخبرة' }
        ]
      },
      contact: { 
        title: 'تواصل معنا', 
        subtitle: 'نحن هنا للإجابة على استفساراتك ومساعدتك في رحلتك إلى ألمانيا. أرسل لنا رسالة وسنقوم بالرد عليك في أقرب وقت.',
        firstName: 'الاسم الأول',
        lastName: 'الاسم الأخير',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        message: 'رسالتك هنا...',
        submit: 'إرسال الرسالة' 
      },
     booking: { 
  title: 'احجز الموعد المناسب لك الآن', 
  description: 'ابدأ الآن في التخطيط لمستقبلك في ألمانيا! احجز استشارة شخصية مع خبرائنا لتقييم فرصك وتحديد الخطوات اللازمة لتحقيق حلمك بالسفر والعيش في ألمانيا بنجاح.',
  availableSlots: 'المواعيد المتاحة',
  time: 'الوقت',
  date: 'التاريخ',
  duration: 'لمدة 30 دقيقة',
  booked: 'محجوز',
  noSlots: 'لا توجد مواعيد متاحة حالياً',
  loading: 'جاري تحميل المواعيد...',
  confirmBtn: 'تأكيد الحجز',
  am: 'صباحاً',
  pm: 'مساءً'
},
      footer: {
  rights: 'تُعالج جميع البيانات وفقاً لقانون حماية البيانات الألماني (DSGVO)، ولا يُعد المحتوى استشارة قانونية.'
}
    },
  },
  de: {
    translation: {
      nav: { about: 'Über uns', services: 'Leistungen', consultations: 'Beratungen', contact: 'Kontakt' },
      hero: {
        title: 'Denken Sie darüber nach, nach Deutschland zu reisen?',
        description: 'Wir bieten umfassende Beratungen an, um Ihren Erfolg in Deutschland zu sichern.',
        cta: 'Jetzt Beratung buchen!',
      },
      about: {
        title: 'Über Uns',
        description: 'Wir sind darauf spezialisiert, umfassende Beratung für Menschen anzubieten, die nach Deutschland ziehen möchten, sei es zum Arbeiten, Studieren oder für eine Ausbildung.',
        mission: 'Unsere Mission ist es, alle rechtlichen und verfahrenstechnischen Hindernisse zu überwinden und die notwendige Unterstützung für Ihre erfolgreiche Integration zu bieten.',
        cta: 'Erfahren Sie mehr'
      },
      services: {
        title: 'Unsere Leistungen 🇩🇪',
        subtitle: 'Wir bieten Beratungen für Arbeit, Studium oder Berufsausbildung in Deutschland.',
        items: [
          { title: 'Arbeiten in Deutschland', features: ['Jobsuche', 'Lebenslauf-Erstellung', 'Anschreiben-Service', 'Vertragsprüfung'] },
          { title: 'Berufsausbildung', features: ['Ausbildungsplatzsuche', 'Qualifikationsberatung', 'Bewerbungsunterlagen', 'Vertragsprüfung'] },
          { title: 'Studieren in Deutschland', features: ['Studienberatung', 'Universitätswahl', 'Bewerbungsprozess', 'Zeugnisanerkennung'] },
          { title: 'Unterkunftssuche', features: ['Wohnungssuche', 'Mietvertragsprüfung', 'Temporäre Unterkunft', 'Standortberatung'] },
          { title: 'Anerkennung von Zeugnissen', features: ['Bewertung von Abschlüssen', 'Behördenkontakt', 'Dokumentenübersetzung', 'Verfahrensbegleitung'] },
          { title: 'Visa-Service', features: ['Vorbereitung der Unterlagen', 'Terminbuchung', 'Reiseversicherung', 'Interview-Vorbereitung'] }
        ]
      },
      stats: {
        items: [
          { label: 'Beratungen durchgeführt' },
          { label: 'Erfolgreiche Vermittlungen' },
          { label: 'Jahre Erfahrung' }
        ]
      },
      contact: { 
        title: 'Kontaktieren Sie uns', 
        subtitle: 'Wir sind hier, um Ihre Fragen zu beantworten und Ihnen bei Ihrer Reise nach Deutschland zu helfen.',
        firstName: 'Vorname',
        lastName: 'Nachname',
        email: 'E-Mail',
        phone: 'Telefonnummer',
        message: 'Ihre Nachricht hier...',
        submit: 'Nachricht senden' 
      },
      booking: { 
  title: 'Buchen Sie jetzt Ihren passenden Termin', 
  description: 'Beginnen Sie jetzt mit der Planung Ihrer Zukunft in Deutschland! Buchen Sie ein persönliches Beratungsgespräch mit unseren Experten.',
  availableSlots: 'Verfügbare Termine',
  time: 'Zeit',
  date: 'Datum',
  duration: 'Dauer: 30 Min.',
  booked: 'GEBUCHT',
  noSlots: 'Derzeit keine Termine verfügbar',
  loading: 'Termine werden geladen...',
  confirmBtn: 'Buchung bestätigen',
  am: 'Uhr',
  pm: 'Uhr'
},
      footer: {
  rights: 'Alle Daten werden gemäß der DSGVO verarbeitet. Der Inhalt stellt keine Rechtsberatung dar.'
}
    },
  },
  en: {
    translation: {
      nav: { about: 'About Us', services: 'Services', consultations: 'Consultations', contact: 'Contact Us' },
      hero: {
        title: 'Thinking about traveling to Germany?',
        description: 'We provide comprehensive consultations to secure your success in Germany.',
        cta: 'Book a consultation now!',
      },
      about: {
        title: 'About Us',
        description: 'We specialize in providing comprehensive consulting for individuals wishing to move to Germany, whether for work, study, or vocational training.',
        mission: 'Our mission is to overcome all legal and procedural obstacles and provide the necessary support to ensure your successful integration into German society.',
        cta: 'Learn More'
      },
      services: {
        title: 'Our Services 🇩🇪',
        subtitle: 'Comprehensive consulting for work, study, or vocational training in Germany.',
        items: [
          { title: 'Work in Germany', features: ['Job search assistance', 'CV Preparation', 'Cover Letter writing', 'Contract review'] },
          { title: 'Vocational Training', features: ['Finding apprenticeships', 'Qualification guidance', 'Application papers', 'Contract review'] },
          { title: 'Study in Germany', features: ['Academic consulting', 'University selection', 'Application support', 'Certificate recognition'] },
          { title: 'Housing Assistance', features: ['Finding accommodation', 'Rental contract review', 'Temporary housing', 'Area guidance'] },
          { title: 'Recognition of Degrees', features: ['Degree evaluation', 'Authority contact', 'Document translation', 'Process tracking'] },
          { title: 'Visa Support', features: ['Embassy file preparation', 'Appointment booking', 'Travel insurance', 'Interview preparation'] }
        ]
      },
      stats: {
        items: [
          { label: 'Consultations Provided' },
          { label: 'Successful Placements' },
          { label: 'Years of Experience' }
        ]
      },
      contact: { 
        title: 'Contact Us', 
        subtitle: 'We are here to answer your questions and help you with your journey to Germany.',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Your message here...',
        submit: 'Send Message' 
      },
     booking: { 
  title: 'Book Your Perfect Appointment Now', 
  description: 'Start planning your future in Germany today! Book a personal consultation with our experts to evaluate your opportunities.',
  availableSlots: 'Available Slots',
  time: 'Time',
  date: 'Date',
  duration: 'For 30 Minutes',
  booked: 'BOOKED',
  noSlots: 'No slots available at the moment',
  loading: 'Loading slots...',
  confirmBtn: 'Confirm Booking',
  am: 'AM',
  pm: 'PM'
},
      footer: {
  rights: 'All data is processed in accordance with the GDPR. Content does not constitute legal advice.'
}








      
    },
  },
};








i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
    interpolation: { escapeValue: false },
  });

export default i18n;