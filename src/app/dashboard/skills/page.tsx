'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useSkills } from '@/hooks/useSkills';
import { useToast } from '@/hooks/useToast';
import { Skill, SkillLevel } from '@/types/Skill/Skill';

export default function SkillsPage() {
  const router = useRouter();
  const { skills, loading, deleteSkill } = useSkills();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la compétence "${name}" ?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteSkill(id);
      toast.success('Compétence supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la compétence');
    } finally {
      setDeletingId(null);
    }
  };

  const getSkillLevelBadge = (level: SkillLevel) => {
    const levelConfig = {
      [SkillLevel.BEGINNER]: { label: 'Débutant', variant: 'secondary' as const },
      [SkillLevel.INTERMEDIATE]: { label: 'Intermédiaire', variant: 'default' as const },
      [SkillLevel.ADVANCED]: { label: 'Avancé', variant: 'outline' as const },
      [SkillLevel.EXPERT]: { label: 'Expert', variant: 'default' as const },
    };

    const config = levelConfig[level];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getSkillLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER:
        return 'bg-gray-100 border-gray-300';
      case SkillLevel.INTERMEDIATE:
        return 'bg-blue-100 border-blue-300';
      case SkillLevel.ADVANCED:
        return 'bg-orange-100 border-orange-300';
      case SkillLevel.EXPERT:
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compétences</h1>
          <p className="text-muted-foreground">
            Gérez vos compétences techniques et leur niveau de maîtrise
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/skills/new')}>
          Nouvelle compétence
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Aucune compétence</h3>
            <p className="text-muted-foreground">
              Commencez par créer votre première compétence
            </p>
            <Button onClick={() => router.push('/dashboard/skills/new')}>
              Créer une compétence
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className={`p-6 border-l-4 ${getSkillLevelColor(skill.level)}`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {skill.icon && (
                        <i className={`${skill.icon} text-lg`} />
                      )}
                      <h3 className="font-semibold text-lg">{skill.name}</h3>
                    </div>
                    {getSkillLevelBadge(skill.level)}
                  </div>
                </div>

                {skill.yearsExp && (
                  <div className="text-sm text-muted-foreground">
                    <strong>{skill.yearsExp}</strong> année{skill.yearsExp > 1 ? 's' : ''} d'expérience
                  </div>
                )}

                {skill.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {skill.description}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/skills/${skill.id}`)}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(skill.id, skill.name)}
                    disabled={deletingId === skill.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === skill.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Supprimer'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
