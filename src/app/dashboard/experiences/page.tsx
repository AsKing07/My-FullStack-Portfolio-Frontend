'use client';

import { useRouter } from 'next/navigation';
import { useExperiences } from '@/hooks/useExperience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth_store';
import { useRef } from 'react';

export default function ExperiencesPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { experiences, loading, error, deleteExperience, updateResume } = useExperiences();
  const { user, refetchUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);


const handleDelete = async (id: string) => {
  if (confirm('Supprimer cette expérience ?')) {
    try {
      await deleteExperience(id);
      toast.success('Expérience supprimée avec succès');
    } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }
};

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.type !== 'application/pdf') {
    toast.error('Seuls les fichiers PDF sont acceptés');
    return;
  }

  try {
    await updateResume(file);
    await refetchUser();
    toast.success('CV mis à jour avec succès');
  } catch (err) {
    toast.error(`Erreur lors de la mise à jour du CV : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
  }
};

const handleDownloadCV = () => {
  if (user?.resumeUrl) {
    window.open(user.resumeUrl, '_blank');
  } else {
    toast.error('Aucun CV disponible');
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expériences</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard/experiences/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle expérience
          </Button>
        </div>
      </div>

      {/* Section CV */}
      <Card>
        <CardHeader>
          <CardTitle>Mon CV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {user?.resumeUrl ? 'CV disponible' : 'Aucun CV téléchargé'}
            </div>
            <div className="flex gap-2">
              {user?.resumeUrl && (
                <Button variant="outline" onClick={handleDownloadCV}>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger CV
                </Button>
              )}
              <Button 
                variant="default" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {user?.resumeUrl ? 'Remplacer CV' : 'Télécharger CV'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Sélectionner un fichier CV"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des expériences</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : experiences.length === 0 ? (
            <div>Aucune expérience enregistrée.</div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2 gap-2">
                  <div>
                    <div className="font-semibold">{exp.title} <span className="text-muted-foreground">({exp.company})</span></div>
                    <div className="text-sm text-muted-foreground">{exp.location}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{exp.type}</Badge>
                      {exp.current && <Badge variant="default">En poste</Badge>}
                    </div>
                    <div className="text-xs mt-1">
                      {exp.startDate && formatDate(exp.startDate)} 
                      {exp.endDate ? ` - ${formatDate(exp.endDate)}` : " - En cours"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/experiences/${exp.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={()=>handleDelete(exp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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