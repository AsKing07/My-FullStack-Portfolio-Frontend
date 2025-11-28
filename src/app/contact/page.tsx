'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { Textarea } from '@/components/ui/form/textarea_component';
import { Button } from '@/components/ui/button_component';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Globe, Building2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import { useContacts } from '@/hooks/useContact';
import { ContactRequest } from '@/types/Contact/ContactRequest';
import { LoadingSpinner } from '@/components/ui/loading_spinner';

export default function ContactPage() {
  const { user, loading: loadingUser, error: errorUser } = useUser();
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
    user?.email ? { icon: Mail, label: 'Email', value: user.email, href: `mailto:${user.email}` } : null,
    user?.phone ? { icon: Phone, label: 'Téléphone', value: user.phone, href: `tel:${user.phone}` } : null,
    user?.location ? { icon: MapPin, label: 'Localisation', value: user.location, href: '#' } : null,
    user?.website ? { icon: Globe, label: 'Site web', value: user.website, href: user.website } : null
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
      const data :ContactRequest ={
           name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
        subject: formData.subject,
        message: formData.message,
      }
      await createContact(data);
      toast.success('Message envoyé avec succès!');
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
      toast.error("Erreur lors de l'envoi du message");
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

if(loadingUser) {
return(
  <div className="flex-1 flex flex-col justify-center items-center min-h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">        
  <div className="container mx-auto">
    
     <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <LoadingSpinner />
</div>
        </div>
      </div>
)
         
}

if (errorUser) {
  return (
    <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
          An error has occurred
        </h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          Error loading contact information&nbsp;:<br />
          <span className="font-mono break-all">{errorUser}</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 drop-shadow flex items-center justify-center gap-3">
          <Send className="w-10 h-10 text-primary" />
            Contact
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Want to discuss a project or just say hello? Do not hesitate to contact me!
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
                  Send me a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Votre numéro"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Votre société"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-2">
                      Web Site
                    </label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://votre-site.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      placeholder="Votre message..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? 'Envoi...' : 'Envoyer le message'}
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
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.length === 0 && (
                  <div className="text-muted-foreground">No contact information available.</div>
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
                <CardTitle>Social Networks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {socialLinks.length === 0 && (
                    <span className="text-muted-foreground">No social networks entered.</span>
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
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available for new projects</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                   I usually respond within 24 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}