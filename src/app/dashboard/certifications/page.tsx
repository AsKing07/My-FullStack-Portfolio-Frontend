'use client';

import { useRouter } from 'next/navigation';
import { useCertifications } from '@/hooks/useCertifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';

export default function CertificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { certifications, loading, error, deleteCertification } = useCertifications();

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette certification ?')) {
      try {
        await deleteCertification(id);
        toast.success('Certification supprimée avec succès');
      } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Certifications</h1>
        <Button onClick={() => router.push('/dashboard/certifications/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle certification
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : certifications.length === 0 ? (
            <div>Aucune certification enregistrée.</div>
          ) : (
            <div className="space-y-4">
              {certifications.map((cert) => {
                const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
                return (
                  <div key={cert.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
                    <div>
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                      <div className="flex gap-2 mt-2">
                        {cert.expiryDate ? (
                          <Badge variant={isExpired ? 'destructive' : 'secondary'}>
                            {isExpired ? 'Expirée' : `Expire le ${formatDate(cert.expiryDate)}`}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Sans expiration</Badge>
                        )}
                      </div>
                      <div className="text-xs mt-1">
                        Obtenue le {formatDate(cert.issueDate)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/certifications/${cert.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
