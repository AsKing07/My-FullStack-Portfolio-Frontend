'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useSkills } from '@/hooks/useSkills';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/hooks/useToast';
import { Skill, SkillLevel } from '@/types/Skill/Skill';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';

type SortField = 'name' | 'level' | 'yearsExp' | 'category';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function SkillsPage() {
  const router = useRouter();
  const { skills, loading, deleteSkill } = useSkills();
  const { categories } = useCategory();
  const { toast } = useToast();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Tri et filtrage des compétences
  const sortedAndFilteredSkills = useMemo(() => {
    let filtered = [...skills];

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => 
        skill.category?.id=== selectedCategory
      );
    }

    // Filtrage par niveau
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(skill => 
        skill.level === selectedLevel
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'level':
          const levelOrder = {
            [SkillLevel.BEGINNER]: 1,
            [SkillLevel.INTERMEDIATE]: 2,
            [SkillLevel.ADVANCED]: 3,
            [SkillLevel.EXPERT]: 4,
          };
          aValue = levelOrder[a.level];
          bValue = levelOrder[b.level];
          break;
        case 'yearsExp':
          aValue = a.yearsExp || 0;
          bValue = b.yearsExp || 0;
          break;
        case 'category':
          const aCategoryName = categories.find(cat => cat.id === a.category?.id)?.name || '';
          const bCategoryName = categories.find(cat => cat.id === b.category?.id)?.name || '';
          aValue = aCategoryName.toLowerCase();
          bValue = bCategoryName.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [skills, categories, selectedCategory, selectedLevel, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Sans catégorie';
    return categories.find(cat => cat.id === categoryId)?.name || 'Catégorie inconnue';
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

      {/* Filtres et options de tri */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filtre par catégorie */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <select
                title='Filtrez par catégorie'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par niveau */}
            <div className="flex items-center gap-2">
              <select
              title='Filtrez par niveau'
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les niveaux</option>
                <option value={SkillLevel.BEGINNER}>Débutant</option>
                <option value={SkillLevel.INTERMEDIATE}>Intermédiaire</option>
                <option value={SkillLevel.ADVANCED}>Avancé</option>
                <option value={SkillLevel.EXPERT}>Expert</option>
              </select>
            </div>

            {/* Options de tri */}
            <div className="flex items-center gap-2">
              <Button
                variant={sortField === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('name')}
                className="flex items-center gap-1"
              >
                Nom
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </Button>
              
              <Button
                variant={sortField === 'level' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('level')}
                className="flex items-center gap-1"
              >
                Niveau
                {sortField === 'level' && (
                  sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </Button>

              <Button
                variant={sortField === 'yearsExp' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('yearsExp')}
                className="flex items-center gap-1"
              >
                Expérience
                {sortField === 'yearsExp' && (
                  sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </Button>

              <Button
                variant={sortField === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('category')}
                className="flex items-center gap-1"
              >
                Catégorie
                {sortField === 'category' && (
                  sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          {/* Toggle vue grille/liste */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className="mt-4 text-sm text-muted-foreground">
          {sortedAndFilteredSkills.length} compétence{sortedAndFilteredSkills.length > 1 ? 's' : ''} 
          {selectedCategory !== 'all' || selectedLevel !== 'all' ? ' (filtrée)' : ''}
        </div>
      </Card>

      {/* Liste des compétences */}
      {sortedAndFilteredSkills.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">
              {skills.length === 0 ? 'Aucune compétence' : 'Aucun résultat'}
            </h3>
            <p className="text-muted-foreground">
              {skills.length === 0 
                ? 'Commencez par créer votre première compétence'
                : 'Essayez de modifier vos filtres'
              }
            </p>
            {skills.length === 0 && (
              <Button onClick={() => router.push('/dashboard/skills/new')}>
                Créer une compétence
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {sortedAndFilteredSkills.map((skill) => (
            <Card 
              key={skill.id} 
              className={`${viewMode === 'grid' 
                ? `p-6 border-l-4 ${getSkillLevelColor(skill.level)}` 
                : 'p-4'
              }`}
            >
              <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center justify-between'}>
                <div className={viewMode === 'grid' ? 'flex items-start justify-between' : 'flex items-center gap-4'}>
                  <div className={viewMode === 'grid' ? 'space-y-1' : 'flex items-center gap-4'}>
                    <div className="flex items-center gap-2">
                      {skill.icon && (
                        <i className={`${skill.icon} text-lg`} />
                      )}
                      <h3 className="font-semibold text-lg">{skill.name}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getSkillLevelBadge(skill.level)}
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(skill.category?.id)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {viewMode === 'grid' && (
                  <>
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
                  </>
                )}

                <div className={viewMode === 'grid' ? 'flex gap-2 pt-2' : 'flex gap-2'}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/skills/${skill.id}`)}
                    className={viewMode === 'grid' ? 'flex-1' : ''}
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