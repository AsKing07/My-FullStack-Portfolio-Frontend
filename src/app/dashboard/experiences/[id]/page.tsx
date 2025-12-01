'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExperiences } from '@/hooks/useExperience';
import { ExperienceType } from '@/types/Experience/Experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { TextArea } from '@radix-ui/themes';
import { Button } from '@/components/ui/button_component';
import { Select } from '@radix-ui/themes';
import { Checkbox } from '@radix-ui/themes';
import { useToast } from '@/hooks/useToast';

const formSchema = z.object({
  title: z.string().min(2, 'Titre requis'),
  company: z.string().min(2, 'Entreprise requise'),
  location: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  type: z.nativeEnum(ExperienceType),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean().optional(),
}).refine((data) => {
  // Si c'est un emploi actuel, la date de fin n'est pas requise
  if (data.current) {
    return true;
  }
  // Si ce n'est pas un emploi actuel, la date de fin est requise
  return data.endDate !== undefined;
}, {
  message: "La date de fin est requise si ce n'est pas un emploi actuel",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

export default function EditExperiencePage() {
    const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { getExperienceById, updateExperience, loading } = useExperiences();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      description: '',
      technologies: '',
      type: ExperienceType.FULLTIME,
      startDate: undefined,
      endDate: undefined,
      current: false,
    },
  });

  useEffect(() => {
    async function fetchData() {
      const exp = await getExperienceById(params.id as string);
      if (exp) {
        form.reset({
          title: exp.title,
          company: exp.company,
          location: exp.location || '',
          description: exp.description || '',
          technologies: exp.technologies || '',
          type: exp.type,
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          current: exp.current,
        });
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [params.id]);

  const onSubmit = async (values: FormValues) => {
    try {
      // Si c'est un emploi actuel, on supprime la date de fin
      const experienceData: any = {
        ...values,
      };
      
      // Si c'est un emploi actuel, on supprime complètement endDate
      if (values.current) {
        delete experienceData.endDate;
      }

      await updateExperience(params.id as string, experienceData);
      toast.success('Expérience modifiée avec succès');
      router.push('/dashboard/experiences');
    } catch {
      toast.error('Erreur lors de la modification');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'expérience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input {...form.register('title')} placeholder="Titre du poste" />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <Input {...form.register('company')} placeholder="Entreprise" />
              {form.formState.errors.company && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.company.message}</p>
              )}
            </div>
            
            <Input {...form.register('location')} placeholder="Lieu" />
            <TextArea {...form.register('description')} placeholder="Description" rows={3} />
            <Input {...form.register('technologies')} placeholder="Technologies (séparées par des virgules)" />
            
            <Select.Root value={form.watch('type')} onValueChange={val => form.setValue('type', val as ExperienceType)}>
              <Select.Trigger placeholder='Type de contrat' />
              <Select.Content>
                <Select.Item value={ExperienceType.FULLTIME}>CDI</Select.Item>
                <Select.Item value={ExperienceType.PARTTIME}>Temps partiel</Select.Item>
                <Select.Item value={ExperienceType.FREELANCE}>Freelance</Select.Item>
                <Select.Item value={ExperienceType.INTERNSHIP}>Stage</Select.Item>
                <Select.Item value={ExperienceType.CONTRACT}>Contrat</Select.Item>
                <Select.Item value={ExperienceType.APPRENTICESHIP}>Apprentissage</Select.Item>
                <Select.Item value={ExperienceType.VOLUNTEER}>Bénévolat</Select.Item>
              </Select.Content>
            </Select.Root>
            
            <div className="flex gap-2 items-center">
              <Checkbox 
                checked={form.watch('current')} 
                onCheckedChange={val => {
                  form.setValue('current', !!val);
                  // Effacer la date de fin si emploi actuel
                  if (val) {
                    form.setValue('endDate', undefined);
                  }
                }} 
              />
              <span>Poste actuel</span>
            </div>
            
            <div>
              <Input
                type="date"
                {...form.register('startDate', { valueAsDate: true })}
                placeholder="Date de début"
              />
              {form.formState.errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.startDate.message}</p>
              )}
            </div>
            
            {!form.watch('current') && (
              <div>
                <Input
                  type="date"
                  {...form.register('endDate', { valueAsDate: true })}
                  placeholder="Date de fin"
                />
                {form.formState.errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.endDate.message}</p>
                )}
              </div>
            )}
            
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}