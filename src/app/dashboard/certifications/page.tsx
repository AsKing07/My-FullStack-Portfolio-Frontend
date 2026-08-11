'use client';

import { useRouter } from 'next/navigation';
import { useCertifications } from '@/hooks/useCertifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Plus, Edit, Trash2, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { buildLinkedInAddCertificationUrl } from '@/lib/linkedin';
import { Certification } from '@/types/Certification/Certification';

export default function CertificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // limit relevé pour ne pas perdre de certifications hors de la première page
  // (pas de pagination UI ici pour l'instant) — pertinent surtout depuis l'ajout
  // des sous-certifications qui font grossir la liste.
  const { certifications, loading, error, deleteCertification, updateCertification } = useCertifications({ limit: 100 });

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

  const handleAddToLinkedIn = async (cert: Certification) => {
    window.open(buildLinkedInAddCertificationUrl(cert), '_blank', 'noopener,noreferrer');
    const confirmed = confirm('As-tu bien ajouté cette certification sur LinkedIn ?');
    if (!confirmed) return;
    try {
      await updateCertification(cert.id, { ...cert, linkedinAddedAt: new Date() });
      toast.success('Marqué comme ajouté à LinkedIn');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
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
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cert.expiryDate ? (
                          <Badge variant={isExpired ? 'destructive' : 'secondary'}>
                            {isExpired ? 'Expirée' : `Expire le ${formatDate(cert.expiryDate)}`}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Sans expiration</Badge>
                        )}
                        {cert.children && cert.children.length > 0 && (
                          <Badge variant="secondary">{cert.children.length} sous-certification(s)</Badge>
                        )}
                        {cert.parent && (
                          <Badge variant="secondary">Sous-certif de : {cert.parent.name}</Badge>
                        )}
                        {cert.linkedinAddedAt && (
                          <Badge variant="secondary">✓ LinkedIn ({formatDate(cert.linkedinAddedAt)})</Badge>
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
                        title={cert.linkedinAddedAt ? 'Ajouter quand même à LinkedIn' : 'Ajouter à LinkedIn'}
                        onClick={() => handleAddToLinkedIn(cert)}
                      >
                        <Linkedin className="h-4 w-4" />
                      </Button>
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
