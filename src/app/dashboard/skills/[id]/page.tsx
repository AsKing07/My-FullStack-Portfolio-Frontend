'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useSkills } from '@/hooks/useSkills';
import { useCategory } from '@/hooks/useCategory';
import { useToast } from '@/hooks/useToast';
import { SkillLevel } from '@/types/Skill/Skill';

const skillSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  level: z.nativeEnum(SkillLevel, {
    errorMap: () => ({ message: 'Veuillez sélectionner un niveau de compétence' }),
  }),
  yearsExp: z.number()
    .min(0, 'Le nombre d\'années d\'expérience doit être positif')
    .max(50, 'Le nombre d\'années d\'expérience ne peut pas dépasser 50')
    .optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  categoryId: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.id as string;
  const { getSkillById, updateSkill } = useSkills();
  const { categories } = useCategory();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  useEffect(() => {
    const loadSkill = async () => {
      if (!skillId) return;
      
      setIsLoading(true);
      try {
        const skill = await getSkillById(skillId);
        if (skill) {
          reset({
            name: skill.name,
            level: skill.level,
            yearsExp: skill.yearsExp || undefined,
            description: skill.description || '',
            icon: skill.icon || '',
            categoryId: skill.category?.id || '',
          });
        } else {
          toast.error('Compétence non trouvée');
          router.push('/dashboard/skills');
        }
      } catch (error) {
        toast.error('Erreur lors du chargement de la compétence');
        router.push('/dashboard/skills');
      } finally {
        setIsLoading(false);
      }
    };

    loadSkill();
  }, [skillId,router]);

  const onSubmit = async (data: SkillFormData) => {
    if (!skillId) return;
    
    setIsSubmitting(true);
    
    try {
      // Convertir yearsExp en nombre si fourni
      const skillData = {
        ...data,
        yearsExp: data.yearsExp ? Number(data.yearsExp) : undefined,
      };
      
      await updateSkill(skillId, skillData);
      toast.success('Compétence modifiée avec succès');
      router.push('/dashboard/skills');
    } catch (error) {
      toast.error('Erreur lors de la modification de la compétence');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillLevels = [
    { value: SkillLevel.BEGINNER, label: 'Débutant' },
    { value: SkillLevel.INTERMEDIATE, label: 'Intermédiaire' },
    { value: SkillLevel.ADVANCED, label: 'Avancé' },
    { value: SkillLevel.EXPERT, label: 'Expert' },
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
          <h1 className="text-3xl font-bold tracking-tight">Modifier la Compétence</h1>
          <p className="text-muted-foreground">Modifier les informations de la compétence</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/skills')}
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
                Nom de la compétence *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="Ex: React, TypeScript, Python..."
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Niveau */}
            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">
                Niveau de maîtrise *
              </label>
              <select
                id="level"
                {...register('level')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Sélectionner un niveau</option>
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-sm text-red-600">{errors.level.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Années d'expérience */}
            <div className="space-y-2">
              <label htmlFor="yearsExp" className="text-sm font-medium">
                Années d'expérience
              </label>
              <input
                id="yearsExp"
                type="number"
                min="0"
                max="50"
                {...register('yearsExp', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                placeholder="0"
              />
              {errors.yearsExp && (
                <p className="text-sm text-red-600">{errors.yearsExp.message}</p>
              )}
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label htmlFor="categoryId" className="text-sm font-medium">
                Catégorie
              </label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Sélectionner une catégorie (optionnel)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
              placeholder="Description de votre expérience avec cette compétence..."
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
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
              placeholder="Ex: fab fa-react, fab fa-js-square, fab fa-python..."
            />
            <p className="text-xs text-muted-foreground">
              Classe FontAwesome (ex: fab fa-react, fas fa-code, etc.)
            </p>
            {errors.icon && (
              <p className="text-sm text-red-600">{errors.icon.message}</p>
            )}
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
                'Modifier la compétence'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/dashboard/skills')}
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
