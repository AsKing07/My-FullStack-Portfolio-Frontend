import { useState, useEffect, useCallback, useRef } from 'react';
import { CertificationService } from '@/services/certification.service';
import { Certification } from '@/types/Certification/Certification';
import { CertificationRequest } from '@/types/Certification/CertificationRequest';
import { Pagination, PaginationParams } from '@/types/api/ApiResponse';

export function useCertifications(defaultParams?: PaginationParams) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultParamsRef = useRef(defaultParams);
  defaultParamsRef.current = defaultParams;

  const fetchCertifications = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CertificationService.getCertifications({ ...defaultParamsRef.current, ...params });
      setCertifications(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Error loading certifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCertificationById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CertificationService.getCertificationById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Error loading certification');
      throw new Error(err.message || 'Error loading certification');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCertification = useCallback(async (certification: CertificationRequest) => {
    setLoading(true);
    setError(null);
    try {
      await CertificationService.createCertification(certification);
      await fetchCertifications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la certification');
      throw new Error(err.message || 'Erreur lors de la création de la certification');
    } finally {
      setLoading(false);
    }
  }, [fetchCertifications]);

  const updateCertification = useCallback(async (id: string, certification: CertificationRequest) => {
    setLoading(true);
    setError(null);
    try {
      await CertificationService.updateCertification(id, certification);
      await fetchCertifications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de la certification');
      throw new Error(err.message || 'Erreur lors de la modification de la certification');
    } finally {
      setLoading(false);
    }
  }, [fetchCertifications]);

  const deleteCertification = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await CertificationService.deleteCertification(id);
      await fetchCertifications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la certification');
      throw new Error(err.message || 'Erreur lors de la suppression de la certification');
    } finally {
      setLoading(false);
    }
  }, [fetchCertifications]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return {
    certifications,
    pagination,
    loading,
    error,
    fetchCertifications,
    getCertificationById,
    createCertification,
    updateCertification,
    deleteCertification,
  };
}
