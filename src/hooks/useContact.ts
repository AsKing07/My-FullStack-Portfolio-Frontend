import { useState, useEffect, useCallback } from 'react';
import { ContactService } from '@/services/contact.service';
import { Contact } from '@/types/Contact/Contact';
import { ContactRequest } from '@/types/Contact/ContactRequest';
import { useAuthStore } from '@/stores/auth_store';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ContactService.getContacts();
      setContacts(res.data.items || []);
    } catch (err: any) {
      setError(err.message || 'Error loading contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getContactById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ContactService.getContactById(id);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Error loading contact');
      throw new Error(err.message || 'Error loading contact');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  const createContact = useCallback(async (contact: ContactRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.createContact(contact);

    } catch (err: any) {
      setError(err.message || 'Error creating contact');
       throw  new Error(err.message || 'Error creating contact');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ContactService.markAsRead(id);
fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du marquage comme lu');
      throw new Error(err.message || 'Erreur lors du marquage comme lu');
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
      throw new Error(err.message || 'Erreur lors de la réponse au contact');
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
      throw new Error(err.message || 'Erreur lors de la suppression du contact');
    } finally {
      setLoading(false);
    }
  }, [fetchContacts]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated, fetchContacts]);

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