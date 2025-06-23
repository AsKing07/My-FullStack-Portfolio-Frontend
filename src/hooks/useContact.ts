import { useState, useEffect, useCallback } from 'react';
import { ContactService } from '@/services/contact.service';
import { Contact } from '@/types/Contact/Contact';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ContactService.getContacts();
      setContacts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getContactById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ContactService.getContactById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du contact');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = useCallback(async (contact: Contact) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.createContact(contact);
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du contact');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  const markAsRead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.markAsRead(id);
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du marquage comme lu');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  const replyToContact = useCallback(async (id: string, reply: string) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.replyToContact(id, reply);
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la réponse au contact');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  const deleteContact = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.deleteContact(id);
      await fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du contact');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    getContactById,
    createContact,
    markAsRead,
    replyToContact,
    deleteContact,
  };
}