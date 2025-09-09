import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { translations } from '@/data/translations';
import { formatLebanesePhone } from '@/utils/lebaneseUtils';
import { 
  MapPin, Phone, Mail, Clock, 
  Send, MessageSquare, Calendar
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const { language, isRTL } = useLanguageContext();
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      propertyInterest: ''
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t.phone,
      details: [formatLebanesePhone('+961 76 340 101'), formatLebanesePhone('+961 1 340 101')],
      description: language === 'ar' ? 'متاح من الاثنين إلى الجمعة، 9 صباحاً - 6 مساءً' : 'Available Monday - Friday, 9AM - 6PM'
    },
    {
      icon: Mail,
      title: t.email,
      details: ['zeinasleiman@hotmail.com'],
      description: language === 'ar' ? 'نرد خلال 24 ساعة' : 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      title: t.address,
      details: [language === 'ar' ? 'لبنان' : 'Lebanon'],
      description: language === 'ar' ? 'نخدم جميع أنحاء لبنان' : 'Serving all of Lebanon'
    },
    {
      icon: Clock,
      title: language === 'ar' ? 'ساعات العمل' : 'Hours',
      details: [
        language === 'ar' ? 'الاثنين - الجمعة: 9 صباحاً - 6 مساءً' : 'Mon - Fri: 9AM - 6PM',
        language === 'ar' ? 'السبت: 10 صباحاً - 4 مساءً' : 'Sat: 10AM - 4PM'
      ],
      description: language === 'ar' ? 'الأحد: بموعد مسبق' : 'Sunday: By appointment'
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 fade-in ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {t.contactUs}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'مستعد للعثور على عقار أحلامك في لبنان؟ فريقنا الخبير هنا لمساعدتك في كل خطوة. اتصل بنا اليوم للبدء.'
              : 'Ready to find your dream property in Lebanon? Our expert team is here to help you every step of the way. Contact us today to get started.'
            }
          </p>
        </div>
    
          {/* Contact Information */}
        <div className="flex flex-wrap gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card
                  key={index}
                  className="shadow-card fade-in"
                  style={{ animationDelay: `${index * 0.1}s`, flex: '1 1 300px' }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary mb-2">{info.title}</h3>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-foreground font-medium">
                            {detail}
                          </p>
                        ))}
                        <p className="text-sm text-muted-foreground mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div> 
      </div>
    </div>
  );
};

export default Contact;