import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { z } from 'zod';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'required').max(100),
  company: z.string().trim().max(100).optional(),
  email: z.string().trim().email('invalidEmail').max(255),
  phone: z.string().trim().min(1, 'required').max(20),
  inquiryType: z.enum(['bulk', 'corporate', 'general']),
  message: z.string().trim().min(1, 'required').max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        fieldErrors[field] = t(`contact.errors.${err.message}`);
      });
      setErrors(fieldErrors);
      return;
    }

    // Build WhatsApp message
    const inquiryLabel = t(`contact.inquiryTypes.${formData.inquiryType}`);
    const message = `${t('contact.whatsappIntro')}

${t('contact.form.name')}: ${formData.name}
${formData.company ? `${t('contact.form.company')}: ${formData.company}\n` : ''}${t('contact.form.email')}: ${formData.email}
${t('contact.form.phone')}: ${formData.phone}
${t('contact.form.inquiryType')}: ${inquiryLabel}

${t('contact.form.message')}:
${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/97400000000?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    toast({
      title: t('contact.success.title'),
      description: t('contact.success.description'),
    });

    // Reset form
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      inquiryType: 'general',
      message: '',
    });
  };

  const contactInfo = [
    { icon: Phone, label: t('contact.info.phone'), value: '+974 4400 9000' },
    { icon: Mail, label: t('contact.info.email'), value: 'sales@advanced.qa' },
    { icon: MapPin, label: t('contact.info.address'), value: t('footer.address') },
  ];

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t('contact.title')}
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <Building2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {t('contact.form.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('contact.form.subtitle')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contact.form.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">{t('contact.form.company')}</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.form.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.form.phone')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={errors.phone ? 'border-destructive' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">{t('contact.form.inquiryType')} *</Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) => handleChange('inquiryType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">
                          {t('contact.inquiryTypes.general')}
                        </SelectItem>
                        <SelectItem value="bulk">
                          {t('contact.inquiryTypes.bulk')}
                        </SelectItem>
                        <SelectItem value="corporate">
                          {t('contact.inquiryTypes.corporate')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    {t('contact.form.submit')}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-6 text-lg font-semibold text-foreground">
                  {t('contact.info.title')}
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/5 p-6 md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  {t('contact.corporate.title')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('contact.corporate.description')}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {t('contact.corporate.benefits.pricing')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {t('contact.corporate.benefits.support')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {t('contact.corporate.benefits.delivery')}
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
