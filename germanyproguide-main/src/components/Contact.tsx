import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'motion/react';
import contactImg from '../assets/contact.png';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <section 
      id="contact" 
      className="py-24 bg-white" 
      dir={i18n.dir()} // يضمن انقلاب ترتيب العناصر تلقائياً
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#0359E8] mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* قسم الصورة - يظهر دائماً في الجهة المقابلة للنموذج */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full order-2 lg:order-1" // تجعل الصورة في "البداية" بصرياً
          >
            <div className="rounded-3xl overflow-hidden shadow-lg h-full min-h-[400px]">
              <img
                src={contactImg}
                alt={t('contact.title')}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* قسم النموذج */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full order-1 lg:order-2"
          >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder={t('contact.firstName')} 
                  className="bg-[#F0F5FF] border-0 h-14 rounded-lg focus-visible:ring-1 focus-visible:ring-[#0359E8]" 
                />
                <Input 
                  placeholder={t('contact.lastName')} 
                  className="bg-[#F0F5FF] border-0 h-14 rounded-lg focus-visible:ring-1 focus-visible:ring-[#0359E8]" 
                />
              </div>

              <Input 
                type="email" 
                placeholder={t('contact.email')} 
                className="bg-[#F0F5FF] border-0 h-14 rounded-lg focus-visible:ring-1 focus-visible:ring-[#0359E8]" 
              />
              <Input 
                placeholder={t('contact.phone')} 
                className="bg-[#F0F5FF] border-0 h-14 rounded-lg focus-visible:ring-1 focus-visible:ring-[#0359E8]" 
              />
              <Textarea 
                placeholder={t('contact.message')} 
                className="bg-[#F0F5FF] border-0 rounded-lg min-h-[150px] resize-none focus-visible:ring-1 focus-visible:ring-[#0359E8] pt-4" 
              />
              
              <Button className="w-full bg-[#0359E8] hover:bg-blue-700 text-white py-6 text-lg rounded-lg shadow-md font-bold transition-all">
                {t('contact.submit')}
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}