import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import i18n from 'i18next';

// استخدام متغيرات البيئة (Environment Variables) أفضل للمشاريع الكبيرة
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://germanyproguide.com/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * إعداد "Interceptor" (المراقب):
 * يعمل قبل إرسال كل طلب للتأكد من تحديث البيانات (التوكن واللغة)
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 1. إضافة التوكن تلقائياً
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. مزامنة اللغة الحالية (ar, en, de)
  // نعتمد على i18n.language بشكل أساسي مع قيمة افتراضية
  const currentLanguage = i18n.language || 'ar'; 
  
  // إرسال اللغة في الهيدر (المعيار القياسي)
  config.headers['Accept-Language'] = currentLanguage;

  // إرسال اللغة كبارامتر تلقائي في الرابط (Query Param) 
  // لضمان استلام البيانات المترجمة من قاعدة البيانات دون تكرار الكود في كل دالة
  config.params = {
    ...config.params,
    lang: currentLanguage
  };

  return config;
});

// --- الخدمات (Services) ---
// بفضل الـ interceptor أعلاه، لم نعد بحاجة لكتابة lang: i18n.language في كل طلب يدوياً
export const getServices = (publishedOnly: boolean = true, perPage: number = 50) => 
  apiClient.get(`/services`, {
    params: {
      per_page: perPage,
      published_only: publishedOnly ? '1' : '0',
    }
  });

export const getServiceBySlug = (slug: string) => 
  apiClient.get(`/services/${slug}`);

export const getAvailability = (date: string) => 
  apiClient.get(`/availability`, { 
    params: { 
      date,
      include_booked: 1
    } 
  });
export const createBooking = (bookingData: {
  appointment_slot_id: string;
  full_name: string;
  email: string;
  phone: string;
  notes?: string;
}) => apiClient.post('/bookings', bookingData);

// --- الاتصال (Contact) ---
export const sendContactMessage = (messageData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
}) => apiClient.post('/contact', messageData);

// --- إعدادات الموقع والبيانات العامة ---
export const getHomepageData = () => apiClient.get('/homepage');

export const getSettings = () => apiClient.get('/settings');

export const getStats = () => apiClient.get('/stats');

/**
 * معالج الأخطاء المحسن:
 * يوفر رسائل واضحة بناءً على نوع الخطأ القادم من السيرفر
 */
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: any }>;
    if (axiosError.response) {
      // أخطاء قادمة من السيرفر (مثل 400, 422, 500)
      console.error("API Error Status:", axiosError.response.status);
      return axiosError.response.data;
    } else if (axiosError.request) {
      // خطأ في الاتصال بالسيرفر (Network Error)
      return { message: i18n.t('errors.network', 'خطأ في الاتصال بالسيرفر') };
    }
  }
  return { message: i18n.t('errors.unexpected', 'حدث خطأ غير متوقع') };
};

export default apiClient;