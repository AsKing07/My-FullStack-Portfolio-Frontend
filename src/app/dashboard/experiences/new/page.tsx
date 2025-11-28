'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useExperiences } from '@/hooks/useExperience';
import { ExperienceType } from '@/types/Experience/Experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { Textarea } from '@/components/ui/form/textarea_component';
import { Button } from '@/components/ui/button_component';
import { Select } from '@radix-ui/themes';
import { Checkbox } from '@radix-ui/themes';
import { toast } from 'sonner';

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
});

type FormValues = z.infer<typeof formSchema>;

export default function NewExperiencePage() {
  const router = useRouter();
  const { createExperience, loading, error } = useExperiences();

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

  const onSubmit = async (values: FormValues) => {
    try {
      await createExperience(values).then(()=>{

         if (error) 
      {
                toast.error(`Erreur lors de la création : ${error}`);


      }
      else{
 toast.success('Expérience créée');
      
      router.push('/dashboard/experiences');
      }
      });
     
     
    } catch(error) {
      toast.error(`Erreur lors de la création : ${error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle expérience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input {...form.register('title')} placeholder="Titre du poste" />
            <Input {...form.register('company')} placeholder="Entreprise" />
            <Input {...form.register('location')} placeholder="Lieu" />
            <Textarea {...form.register('description')} placeholder="Description" rows={3} />
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
              <Checkbox checked={form.watch('current')} onCheckedChange={val => form.setValue('current', !!val)} />
              <span>Poste actuel</span>
            </div>
            <Input
              type="date"
              {...form.register('startDate', { valueAsDate: true })}
              placeholder="Date de début"
            />
            {!form.watch('current') && (
              <Input
                type="date"
                {...form.register('endDate', { valueAsDate: true })}
                placeholder="Date de fin"
              />
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