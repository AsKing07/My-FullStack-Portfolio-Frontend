'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/hooks/useContact';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Input } from '@/components/ui/form/input_component';
import { Eye, Trash2, Mail, MailOpen, Clock, CheckCircle, Filter, Search } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { ContactStatus } from '@/types/Contact/Contact';

export default function ContactPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { contacts, loading, error, deleteContact, markAsRead } = useContacts();
  
  // États pour les filtres
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer ce message ?')) {
      try {
        await deleteContact(id);
        toast.success('Message supprimé avec succès');
      } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Message marqué comme lu');
    } catch (err) {
      toast.error(`Erreur lors du marquage : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
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

  // Fonction de filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    // Filtre par statut
    const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter;
    
    // Filtre par recherche (nom, email, sujet, message)
    const matchesSearch = searchQuery === '' || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.subject && contact.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const unreadCount = contacts.filter(contact => contact.status === ContactStatus.UNREAD).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Messages de contact</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 && (
              <span className="text-red-600 font-medium">
                {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Section des filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, sujet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtre par statut */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('ALL')}
              >
                Tous ({contacts.length})
              </Button>
              <Button
                variant={statusFilter === ContactStatus.UNREAD ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ContactStatus.UNREAD)}
                className="flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                Non lus ({contacts.filter(c => c.status === ContactStatus.UNREAD).length})
              </Button>
              <Button
                variant={statusFilter === ContactStatus.READ ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ContactStatus.READ)}
                className="flex items-center gap-1"
              >
                <MailOpen className="w-3 h-3" />
                Lus ({contacts.filter(c => c.status === ContactStatus.READ).length})
              </Button>
              <Button
                variant={statusFilter === ContactStatus.REPLIED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ContactStatus.REPLIED)}
                className="flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                Répondus ({contacts.filter(c => c.status === ContactStatus.REPLIED).length})
              </Button>
              <Button
                variant={statusFilter === ContactStatus.ARCHIVED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(ContactStatus.ARCHIVED)}
                className="flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Archivés ({contacts.filter(c => c.status === ContactStatus.ARCHIVED).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Liste des messages ({filteredContacts.length} sur {contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'ALL' 
                  ? 'Aucun message ne correspond aux critères de recherche.'
                  : 'Aucun message reçu pour le moment.'
                }
              </p>
              {(searchQuery || statusFilter !== 'ALL') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }}
                  className="mt-4"
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContacts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((contact) => (
                <div 
                  key={contact.id} 
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    contact.status === ContactStatus.UNREAD ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        {getStatusBadge(contact.status)}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p><strong>Email:</strong> {contact.email}</p>
                        {contact.phone && <p><strong>Téléphone:</strong> {contact.phone}</p>}
                        {contact.company && <p><strong>Entreprise:</strong> {contact.company}</p>}
                        {contact.subject && <p><strong>Sujet:</strong> {contact.subject}</p>}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm line-clamp-2">{contact.message}</p>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        Reçu le {formatDate(contact.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => router.push(`/dashboard/contact/${contact.id}`)}
                        title="Voir le message"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {contact.status === ContactStatus.UNREAD && (
                        <Button 
                          variant="secondary" 
                          size="icon"
                          onClick={() => handleMarkAsRead(contact.id)}
                          title="Marquer comme lu"
                        >
                          <MailOpen className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
