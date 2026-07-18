'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { Textarea } from '@/components/ui/form/textarea_component';
import { Button } from '@/components/ui/button_component';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useContacts } from '@/hooks/useContact';
import { ContactRequest } from '@/types/Contact/ContactRequest';
import { User } from '@/types/User/User';

interface ContactContentClientProps {
  user: User | null;
}

export function ContactContentClient({ user }: ContactContentClientProps) {
  const t = useTranslations('Contact');
  const { createContact, loading } = useContacts();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Contact info dynamique depuis user
  type ContactInfo = { icon: typeof Mail; label: string; value: string; href: string };
  const contactInfo: ContactInfo[] = [
    user?.email ? { icon: Mail, label: t('infoLabels.email'), value: user.email, href: `mailto:${user.email}` } : null,
    user?.phone ? { icon: Phone, label: t('infoLabels.phone'), value: user.phone, href: `tel:${user.phone}` } : null,
    user?.location ? { icon: MapPin, label: t('infoLabels.location'), value: user.location, href: '#' } : null,
    user?.website ? { icon: Globe, label: t('infoLabels.website'), value: user.website, href: user.website } : null
  ].filter(Boolean) as ContactInfo[];

  // Socials dynamiques depuis user
  type SocialLink = { icon: typeof Github; label: string; href: string; color: string };
  const socialLinks: SocialLink[] = [
    user?.github ? { icon: Github, label: 'GitHub', href: user.github, color: 'hover:text-gray-900 dark:hover:text-gray-100' } : null,
    user?.linkedin ? { icon: Linkedin, label: 'LinkedIn', href: user.linkedin, color: 'hover:text-blue-600' } : null,
    user?.twitter ? { icon: Twitter, label: 'Twitter', href: user.twitter, color: 'hover:text-blue-400' } : null
  ].filter((link): link is SocialLink => Boolean(link));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data: ContactRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
        subject: formData.subject,
        message: formData.message,
      }
      await createContact(data);
      toast.success(t('form.successToast'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('form.errorToast'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 drop-shadow flex items-center justify-center gap-3">
          <Send className="w-10 h-10 text-primary" />
          {t('pageTitle')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('pageSubtitle')}
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                {t('sendMessage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('form.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('form.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('form.emailPlaceholder')}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      {t('form.phone')}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('form.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      {t('form.company')}
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t('form.companyPlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium mb-2">
                    {t('form.website')}
                  </label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder={t('form.websitePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    {t('form.subject')}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t('form.subjectPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('form.message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={7}
                    placeholder={t('form.messagePlaceholder')}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? t('form.sending') : t('form.send')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactInfo.length === 0 && (
                <div className="text-muted-foreground">{t('noContactInfo')}</div>
              )}
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info!.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <info.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{info.label}</p>
                    <a
                      href={info.href}
                      className="text-muted-foreground hover:text-blue-600 transition-colors"
                      target={info.href?.startsWith('http') ? "_blank" : undefined}
                      rel={info.href?.startsWith('http') ? "noopener noreferrer" : undefined}
                    >
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('socialNetworks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {socialLinks.length === 0 && (
                  <span className="text-muted-foreground">{t('noSocialNetworks')}</span>
                )}
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-colors ${social.color}`}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('availability')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{t('availableForProjects')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('responseTime')}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
