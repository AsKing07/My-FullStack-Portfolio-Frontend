'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCertifications } from '@/hooks/useCertifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { TextArea } from '@radix-ui/themes';
import { Button } from '@/components/ui/button_component';
import { ArrowLeft, Save, Image as ImageIcon, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import DatePicker from 'react-datepicker';
import { TextField } from "@radix-ui/themes";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { buildLinkedInAddCertificationUrl } from '@/lib/linkedin';
import { Certification } from '@/types/Certification/Certification';

const formSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  nameFr: z.string().optional(),
  issuer: z.string().min(2, 'Organisme émetteur requis'),
  description: z.string().optional(),
  descriptionFr: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  image: z.string().optional(),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCertificationPage() {
  const router = useRouter();
  const params = useParams();
  const { certifications, getCertificationById, updateCertification, saveCertificationImage, loading } = useCertifications();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [current, setCurrent] = useState<Certification | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      nameFr: '',
      issuer: '',
      description: '',
      descriptionFr: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
      issueDate: undefined,
      expiryDate: undefined,
      parentId: '',
    },
  });

  const parentCandidates = certifications.filter((c) => !c.parentId && c.id !== params.id);

  const handleAddToLinkedIn = async () => {
    if (!current) return;
    window.open(buildLinkedInAddCertificationUrl(current), '_blank', 'noopener,noreferrer');
    const confirmed = confirm('As-tu bien ajouté cette certification sur LinkedIn ?');
    if (!confirmed) return;
    try {
      const now = new Date();
      await updateCertification(current.id, { ...form.getValues(), linkedinAddedAt: now });
      setCurrent({ ...current, linkedinAddedAt: now });
      toast.success('Marqué comme ajouté à LinkedIn');
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Charger les données de la certification
  useEffect(() => {
    async function fetchData() {
      try {
        const certification = await getCertificationById(params.id as string);
        if (certification) {
          const certData = certification.items || certification;
          form.reset({
            name: certData.name,
            nameFr: certData.nameFr || '',
            issuer: certData.issuer,
            description: certData.description || '',
            descriptionFr: certData.descriptionFr || '',
            credentialId: certData.credentialId || '',
            credentialUrl: certData.credentialUrl || '',
            image: certData.image || '',
            issueDate: certData.issueDate ? new Date(certData.issueDate) : undefined,
            expiryDate: certData.expiryDate ? new Date(certData.expiryDate) : undefined,
            parentId: certData.parentId || '',
          });
          setImageUrl(certData.image || '');
          setCurrent(certData);
        } else {
          toast.error('Certification introuvable');
          router.push('/dashboard/certifications');
        }
      } catch (err) {
        toast.error('Erreur lors du chargement de la certification');
        router.push('/dashboard/certifications');
      }
    }
    if (params.id) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [params.id]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = await saveCertificationImage(file);
      if (url) {
        setImageUrl(url);
        form.setValue('image', url);
      }
      toast.success('Image téléchargée avec succès');
    } catch (error) {
      toast.error(`Erreur lors du téléchargement de l'image ` + (error instanceof Error ? error.message : ''));
    }
  };

  const onSubmit = async (values: FormValues) => {
    const duplicate = certifications.find(
      (c) =>
        c.id !== params.id &&
        c.name.trim().toLowerCase() === values.name.trim().toLowerCase() &&
        c.issuer.trim().toLowerCase() === values.issuer.trim().toLowerCase()
    );
    if (duplicate) {
      const proceed = confirm(
        `Une autre certification "${duplicate.name}" de "${duplicate.issuer}" existe déjà. Voulez-vous quand même enregistrer ?`
      );
      if (!proceed) return;
    }

    try {
      await updateCertification(params.id as string, values);
      toast.success('Certification modifiée avec succès');
      router.push('/dashboard/certifications');
    } catch (err) {
      toast.error(`Erreur lors de la modification : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={() => router.push('/dashboard/certifications')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Modifier la certification</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de la certification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="font-semibold">Nom (EN) *</label>
              <Input
                {...form.register('name')}
                placeholder="AWS Certified Developer, Google IT Support..."
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Nom (FR)</label>
              <Input
                {...form.register('nameFr')}
                placeholder="Nom de la certification en français"
              />
            </div>

            <div>
              <label className="font-semibold">Organisme émetteur *</label>
              <Input
                {...form.register('issuer')}
                placeholder="AWS, Google, Coursera..."
              />
              {form.formState.errors.issuer && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.issuer.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold">Certification parente</label>
              <select
                {...form.register('parentId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">Aucune (certification indépendante)</option>
                {parentCandidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {current?.children && current.children.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {current.children.length} sous-certification(s) rattachée(s) : {current.children.map((c) => c.name).join(', ')}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold">Description (EN)</label>
              <TextArea
                {...form.register('description')}
                rows={4}
                placeholder="Description de la certification..."
              />
            </div>

            <div>
              <label className="font-semibold">Description (FR)</label>
              <TextArea
                {...form.register('descriptionFr')}
                rows={4}
                placeholder="Description de la certification en français..."
              />
            </div>

            <div>
              <label className="font-semibold">Identifiant de l'attestation</label>
              <Input
                {...form.register('credentialId')}
                placeholder="Numéro ou identifiant de l'attestation"
              />
            </div>

            <div>
              <label className="font-semibold">Lien de vérification</label>
              <Input
                {...form.register('credentialUrl')}
                placeholder="https://credential-verify.example.com/..."
              />
              {form.formState.errors.credentialUrl && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.credentialUrl.message}</p>
              )}
            </div>

            <div>
              <label className="font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Image du badge
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageUrl && (
                <div className="mt-2">
                  <Image
                    src={imageUrl}
                    alt="Badge"
                    width={96}
                    height={96}
                    className="rounded-lg object-contain border"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className='flex flex-col gap-2'>
                <label className="font-semibold">Date d'obtention *</label>
                <DatePicker
                  selected={form.watch('issueDate')}
                  onChange={(date: Date | null) => form.setValue('issueDate', date as Date)}
                  showPopperArrow={true}
                  popperPlacement="bottom-start"
                  customInput={<TextField.Root />}
                  placeholderText="Sélectionner une date"
                  dateFormat="dd/MM/yyyy"
                />
                {form.formState.errors.issueDate && (
                  <p className="text-red-500 text-sm">{form.formState.errors.issueDate.message}</p>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <label className="font-semibold">Date d'expiration</label>
                <DatePicker
                  selected={form.watch('expiryDate')}
                  onChange={(date: Date | null) => form.setValue('expiryDate', date || undefined)}
                  showPopperArrow={true}
                  popperPlacement="bottom-start"
                  customInput={<TextField.Root />}
                  placeholderText="Sans expiration"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </label>
              <div className="flex items-center gap-3 mt-1">
                <Button type="button" variant="outline" onClick={handleAddToLinkedIn} className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  {current?.linkedinAddedAt ? 'Ajouter quand même' : 'Ajouter à LinkedIn'}
                </Button>
                {current?.linkedinAddedAt && (
                  <span className="text-xs text-muted-foreground">
                    ✓ Ajouté le {formatDate(current.linkedinAddedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/certifications')}
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
