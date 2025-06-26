'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEducations } from '@/hooks/useEducations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { TextArea } from '@radix-ui/themes';
import { Button } from '@/components/ui/button_component';
import { Checkbox } from '@radix-ui/themes';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { TextField } from "@radix-ui/themes";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  degree: z.string().min(2, 'Diplôme requis'),
  school: z.string().min(2, 'École requise'),
  field: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  current: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewEducationPage() {
  const router = useRouter();
  const { createEducation, loading } = useEducations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      degree: '',
      school: '',
      field: '',
      location: '',
      description: '',
      grade: '',
      startDate: undefined,
      endDate: undefined,
      current: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createEducation(values);
      toast.success('Formation créée avec succès');
      router.push('/dashboard/education');
    } catch (err) {
      toast.error(`Erreur lors de la création : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/education')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Nouvelle formation</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la formation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="font-semibold">Diplôme *</label>
              <Input
                {...form.register('degree')}
                placeholder="Master en Informatique, Licence..."
              />
              {form.formState.errors.degree && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.degree.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">École/Université *</label>
              <Input
                {...form.register('school')}
                placeholder="Nom de l'établissement"
              />
              {form.formState.errors.school && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.school.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Domaine d'études</label>
              <Input
                {...form.register('field')}
                placeholder="Informatique, Marketing, Sciences..."
              />
            </div>

            <div>
              <label className="font-semibold">Lieu</label>
              <Input
                {...form.register('location')}
                placeholder="Paris, Lyon, Marseille..."
              />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <TextArea
                {...form.register('description')}
                rows={4}
                placeholder="Description de la formation, spécialisations..."
              />
            </div>

            <div>
              <label className="font-semibold">Note/Mention</label>
              <Input
                {...form.register('grade')}
                placeholder="Mention Très Bien, 15/20..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='flex flex-col gap-2'>
                <label className="font-semibold">Date de début *</label>
                <DatePicker
                  selected={form.watch('startDate')}
                  onChange={(date: Date | null) => form.setValue('startDate', date as Date)}
                  showPopperArrow={true}
                  popperPlacement="bottom-start"
                  customInput={<TextField.Root />}
                  placeholderText="Sélectionner une date"
                  dateFormat="dd/MM/yyyy"
                />
                {form.formState.errors.startDate && (
                  <p className="text-red-500 text-sm">{form.formState.errors.startDate.message}</p>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <label className="font-semibold">Date de fin</label>
                <DatePicker
                  selected={form.watch('endDate')}
                  onChange={(date: Date | null) => form.setValue('endDate', date || undefined)}
                  showPopperArrow={true}
                  popperPlacement="bottom-start"
                  customInput={<TextField.Root />}
                  placeholderText="Sélectionner une date"
                  dateFormat="dd/MM/yyyy"
                  disabled={form.watch('current')}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.watch('current')}
                onCheckedChange={(val: boolean | "indeterminate") => {
                  const isChecked = !!val;
                  form.setValue('current', isChecked);
                  if (isChecked) {
                    form.setValue('endDate', undefined);
                  }
                }}
              />
              <span>Formation en cours</span>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/education')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
