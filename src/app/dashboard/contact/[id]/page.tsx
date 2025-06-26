'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContacts } from '@/hooks/useContact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { TextArea } from '@radix-ui/themes';
import { 
  ArrowLeft, 
  Send, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  Calendar,
  MailOpen,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { ContactStatus } from '@/types/Contact/Contact';
import { LoadingSpinner } from '@/components/ui/loading_spinner';

const replySchema = z.object({
  reply: z.string().min(10, 'La réponse doit contenir au moins 10 caractères'),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getContactById, replyToContact, markAsRead, loading } = useContacts();
  const [contact, setContact] = useState<any>(null);
  const [loadingContact, setLoadingContact] = useState(true);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: '',
    },
  });

  // Charger les données du contact
  useEffect(() => {
    async function fetchContact() {
      try {
        const contactData = await getContactById(params.id as string);
        if (contactData) {
          const contact = contactData;
          setContact(contact);
          
          // Marquer comme lu automatiquement si non lu
          if (contact.status === ContactStatus.UNREAD) {
            await markAsRead(contact.id);
            setContact((prev: typeof contact) => ({ ...prev, status: ContactStatus.READ }));
          }
        } else {
          toast.error('Message introuvable');
          router.push('/dashboard/contact');
        }
      } catch (err) {
        toast.error('Erreur lors du chargement du message');
        router.push('/dashboard/contact');
      } finally {
        setLoadingContact(false);
      }
    }
    
    if (params.id) {
      fetchContact();
    }
    // eslint-disable-next-line
  }, [params.id]);

  const onSubmitReply = async (values: ReplyFormValues) => {
    try {
      await replyToContact(contact.id, values.reply);
      toast.success('Réponse envoyée avec succès');
      form.reset();
      setContact((prev: typeof contact) => ({ ...prev, status: ContactStatus.REPLIED }));
    } catch (err) {
      toast.error(`Erreur lors de l'envoi : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.UNREAD:
        return <Badge variant="destructive" className="flex items-center gap-1"><Mail className="w-3 h-3" />Non lu</Badge>;
      case ContactStatus.READ:
        return <Badge variant="secondary" className="flex items-center gap-1"><MailOpen className="w-3 h-3" />Lu</Badge>;
      case ContactStatus.REPLIED:
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />Répondu</Badge>;
      case ContactStatus.ARCHIVED:
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" />Archivé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  if (loadingContact) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-full w-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Message introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/contact')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux messages
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Détail du message</h2>
      </div>

      {/* Informations du contact */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Message de {contact.name}
            </CardTitle>
            {getStatusBadge(contact.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Téléphone:</span>
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}
              
              {contact.company && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Entreprise:</span>
                  <span>{contact.company}</span>
                </div>
              )}
              
              {contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Site web:</span>
                  <a 
                    href={contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {contact.website}
                  </a>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Reçu le:</span>
                <span>{formatDate(contact.createdAt)}</span>
              </div>
              
              {contact.subject && (
                <div>
                  <span className="font-medium">Sujet:</span>
                  <p className="mt-1">{contact.subject}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle>Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {contact.message}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de réponse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Répondre au message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmitReply)} className="space-y-4">
            <div>
              <label className="font-semibold">Votre réponse</label>
              <TextArea
                {...form.register('reply')}
                rows={6}
                placeholder="Écrivez votre réponse..."
                className="mt-2"
              />
              {form.formState.errors.reply && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.reply.message}
                </p>
              )}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> La réponse sera envoyée à l'adresse email du contact ({contact.email}). 
                Assurez-vous d'avoir configuré votre service d'email pour l'envoi automatique.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/contact')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Envoi...' : 'Envoyer la réponse'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
