'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/hooks/useToast';

const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  slug: z.string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { getCategoryBySlug, updateCategory } = useCategory();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const nameValue = watch('name');


useEffect(() => {
  if (!slug) return;
  
  const loadCategory = async () => {
    setIsLoading(true);
    try {
      const response = await getCategoryBySlug(slug);
      if (response) {
        setCategoryId(response.id);
        reset({
          name: response.name,
          slug: response.slug,
          description: response.description || '',
          color: response.color || '',
          icon: response.icon || '',
        });
      } else {
        toast.error('Catégorie non trouvée');
        router.push('/dashboard/categories');
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement de la catégorie');
      router.push('/dashboard/categories');
    } finally {
      setIsLoading(false);
    }
  };

  loadCategory();
}, [slug]); 

  // Génération automatique du slug basé sur le nom
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâäã]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôöõ]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Mettre à jour le slug quand le nom change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('slug', generateSlug(name));
  };

  const onSubmit = async (data: CategoryFormData) => {
    if (!categoryId) return;
    
    setIsSubmitting(true);
    
    try {
      await updateCategory(categoryId, data);
      toast.success('Catégorie modifiée avec succès');
      router.push('/dashboard/categories');
    } catch (error) {
      toast.error('Erreur lors de la modification de la catégorie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#6B7280', '#14B8A6', '#F97316', '#84CC16'
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier la Catégorie</h1>
          <p className="text-muted-foreground">Modifier les informations de la catégorie</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/categories')}
        >
          Retour
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom de la catégorie *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                onChange={(e) => {
                  register('name').onChange(e);
                  handleNameChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Ex: Développement Web"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug *
              </label>
              <input
                id="slug"
                type="text"
                {...register('slug')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Ex: developpement-web"
              />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Généré automatiquement à partir du nom. Peut être modifié.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Description de la catégorie..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Couleur */}
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Couleur
              </label>
              <div className="space-y-3">
                <input
                  id="color"
                  type="color"
                  {...register('color')}
                  className="w-full h-10 border border-gray-300 rounded-md cursor-pointer dark:border-gray-600"
                />
                <div className="flex flex-wrap gap-2">
                  {commonColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                      aria-label={`Sélectionner la couleur ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Icône */}
            <div className="space-y-2">
              <label htmlFor="icon" className="text-sm font-medium">
                Icône FontAwesome
              </label>
              <input
                id="icon"
                type="text"
                {...register('icon')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Ex: fas fa-code"
              />
              <p className="text-xs text-muted-foreground">
                Classe FontAwesome (ex: fas fa-code, far fa-folder, etc.)
              </p>
              {errors.icon && (
                <p className="text-sm text-red-600">{errors.icon.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Modification...
                </>
              ) : (
                'Modifier la catégorie'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/dashboard/categories')}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
