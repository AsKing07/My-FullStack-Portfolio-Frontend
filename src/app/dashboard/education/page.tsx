'use client';

import { useRouter } from 'next/navigation';
import { useEducations } from '@/hooks/useEducations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';

export default function EducationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { educations, loading, error, deleteEducation } = useEducations();

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette formation ?')) {
      try {
        await deleteEducation(id);
        toast.success('Formation supprimée avec succès');
      } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Formations</h1>
        <Button onClick={() => router.push('/dashboard/education/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle formation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des formations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : educations.length === 0 ? (
            <div>Aucune formation enregistrée.</div>
          ) : (
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
                  <div>
                    <div className="font-semibold">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">{edu.school}</div>
                    {edu.field && (
                      <div className="text-sm text-blue-600">{edu.field}</div>
                    )}
                    {edu.location && (
                      <div className="text-xs text-muted-foreground">{edu.location}</div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {edu.current && <Badge variant="default">En cours</Badge>}
                      {edu.grade && <Badge variant="secondary">{edu.grade}</Badge>}
                    </div>
                    <div className="text-xs mt-1">
                      {edu.startDate && formatDate(edu.startDate)} 
                      {edu.endDate ? ` - ${formatDate(edu.endDate)}` : edu.current ? " - En cours" : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => router.push(`/dashboard/education/${edu.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(edu.id)}
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
