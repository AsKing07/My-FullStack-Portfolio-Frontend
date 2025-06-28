'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCategory } from '@/hooks/useCategory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Plus, Edit, Trash2, Folder, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { Category } from '@/types/Category/Category';

type SortField = 'name' | 'slug' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function CategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { categories, loading, error, deleteCategory } = useCategory();
  
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCategories = useMemo(() => {
    if (!categories.length) return [];

    return [...categories].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'slug':
          aValue = a.slug.toLowerCase();
          bValue = b.slug.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt);
          bValue = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt);
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
  }, [categories, sortField, sortDirection]);

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette catégorie ?')) {
      try {
        await deleteCategory(id);
        toast.success('Catégorie supprimée avec succès');
      } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <Button onClick={() => router.push('/dashboard/categories/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Liste des catégories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune catégorie créée pour le moment.</p>
            </div>
          ) : (
            <>
              {/* En-têtes de tri */}
              <div className="flex items-center gap-4 pb-4 border-b mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Nom
                  {getSortIcon('name')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('slug')}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Slug
                  {getSortIcon('slug')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Date création
                  {getSortIcon('createdAt')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('updatedAt')}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Dernière modification
                  {getSortIcon('updatedAt')}
                </Button>
              </div>

              {/* Liste des catégories triées */}
              <div className="space-y-4">
                {sortedCategories.map((category) => (
                  <div key={category.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <Badge variant="secondary">{category.slug}</Badge>
                      </div>
                      
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Créé le {formatDate(category.createdAt)}</span>
                        {category.updatedAt && category.updatedAt !== category.createdAt && (
                          <span>Modifié le {formatDate(category.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => router.push(`/dashboard/categories/${category.slug}`)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}