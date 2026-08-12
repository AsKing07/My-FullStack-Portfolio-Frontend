'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCertifications } from '@/hooks/useCertifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Input } from '@/components/ui/form/input_component';
import { Plus, Edit, Trash2, Linkedin, Check, X, Search, Layers } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { buildLinkedInAddCertificationUrl } from '@/lib/linkedin';
import { Certification } from '@/types/Certification/Certification';

type TypeFilter = 'all' | 'standalone' | 'parent' | 'child';

export default function CertificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  // limit relevé pour ne pas perdre de certifications hors de la première page
  // (pas de pagination UI ici pour l'instant) — pertinent surtout depuis l'ajout
  // des sous-certifications qui font grossir la liste.
  const { certifications, loading, error, deleteCertification, updateCertification } = useCertifications({ limit: 200 });

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [groupByParent, setGroupByParent] = useState(false);
  // Suivi de la certif pour laquelle on affiche la confirmation LinkedIn en ligne
  // (un window.confirm() juste après window.open() apparaît souvent dans l'onglet
  // resté en arrière-plan, donc invisible pour l'utilisateur qui vient de basculer
  // sur le nouvel onglet LinkedIn — on utilise à la place un état affiché dans la page).
  const [confirmingLinkedInId, setConfirmingLinkedInId] = useState<string | null>(null);

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

  const handleAddToLinkedIn = (cert: Certification) => {
    window.open(buildLinkedInAddCertificationUrl(cert), '_blank', 'noopener,noreferrer');
    setConfirmingLinkedInId(cert.id);
  };

  const handleConfirmLinkedInAdded = async (cert: Certification, added: boolean) => {
    setConfirmingLinkedInId(null);
    if (!added) return;
    try {
      await updateCertification(cert.id, { ...cert, linkedinAddedAt: new Date() });
      toast.success('Marqué comme ajouté à LinkedIn');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const matchesSearch = (cert: Certification) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return cert.name.toLowerCase().includes(q) || cert.issuer.toLowerCase().includes(q);
  };

  const matchesType = (cert: Certification) => {
    const isParent = !!(cert.children && cert.children.length > 0);
    const isChild = !!cert.parentId;
    switch (typeFilter) {
      case 'parent': return isParent;
      case 'child': return isChild;
      case 'standalone': return !isParent && !isChild;
      default: return true;
    }
  };

  const filtered = certifications.filter((c) => matchesSearch(c) && matchesType(c));
  const topLevelFiltered = filtered.filter((c) => !c.parentId);

  const renderRow = (cert: Certification, isChildRow = false) => {
    const isExpired = cert.expiryDate ? new Date(cert.expiryDate) < new Date() : false;
    const isConfirming = confirmingLinkedInId === cert.id;

    return (
      <div
        key={cert.id}
        className={`flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2 ${isChildRow ? 'pl-4 border-l-2' : ''}`}
      >
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

        {isConfirming ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Ajoutée sur LinkedIn ?</span>
            <Button variant="outline" size="sm" onClick={() => handleConfirmLinkedInAdded(cert, true)}>
              <Check className="h-4 w-4 mr-1" /> Oui
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleConfirmLinkedInAdded(cert, false)}>
              <X className="h-4 w-4 mr-1" /> Annuler
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    );
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
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou organisme..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="all">Toutes</option>
              <option value="standalone">Indépendantes</option>
              <option value="parent">Certifications globales</option>
              <option value="child">Sous-certifications</option>
            </select>
            <Button
              type="button"
              variant={groupByParent ? 'default' : 'outline'}
              onClick={() => setGroupByParent((v) => !v)}
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Grouper par parent
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des certifications {filtered.length !== certifications.length && `(${filtered.length}/${certifications.length})`}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div>Aucune certification ne correspond aux filtres.</div>
          ) : groupByParent ? (
            <div className="space-y-6">
              {topLevelFiltered.map((parent) => (
                <div key={parent.id}>
                  {renderRow(parent)}
                  {parent.children && parent.children.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {parent.children.map((child) => renderRow(child, true))}
                    </div>
                  )}
                </div>
              ))}
              {topLevelFiltered.length === 0 && (
                <div className="text-muted-foreground text-sm">Aucune certification globale ne correspond aux filtres.</div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((cert) => renderRow(cert))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
