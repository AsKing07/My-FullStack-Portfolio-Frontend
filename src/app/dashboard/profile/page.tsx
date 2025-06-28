'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { UserRequest } from '@/types/User/UserRequest';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Upload,
  X,
  Save,
  Camera,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/form/input_component';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  linkedin: z.string().url('URL LinkedIn invalide').optional().or(z.literal('')),
  github: z.string().url('URL GitHub invalide').optional().or(z.literal('')),
  twitter: z.string().url('URL Twitter invalide').optional().or(z.literal('')),
  phone: z.string().optional(),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading, updateUser, updateAvatar, updateResume } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedResume, setSelectedResume] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Charger les données utilisateur dans le formulaire
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        title: user.title || '',
        subtitle: user.subtitle || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        twitter: user.twitter || '',
        phone: user.phone || '',
      });
      setAvatarPreview(user.avatarUrl || '');
    }
  }, [user, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }
      
      // Validation de la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setSelectedAvatar(file);
      
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation du type de fichier
      if (file.type !== 'application/pdf') {
        toast.error('Veuillez sélectionner un fichier PDF');
        return;
      }
      
      // Validation de la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le CV ne doit pas dépasser 10MB');
        return;
      }

      setSelectedResume(file);
    }
  };

  const handleRemoveAvatar = () => {
    setSelectedAvatar(null);
    setAvatarPreview(user?.avatarUrl || '');
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleRemoveResume = () => {
    setSelectedResume(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  // Fonction pour filtrer les données vides
  const filterEmptyFields = (data: ProfileFormData): Partial<UserRequest> => {
    const filteredData: Partial<UserRequest> = {};


    filteredData.name = data.name;
    filteredData.email = data.email;

    // Inclure uniquement les champs non vides
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ProfileFormData];
      
      // Exclure name et email car déjà ajoutés
      if (key === 'name' || key === 'email') return;
      
      // Inclure seulement les valeurs non nulles, non undefined et non chaînes vides
      if (value && value.toString().trim() !== '') {
        (filteredData as any)[key] = value;
      }
    });

    return filteredData;
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Filtrer les données pour ne garder que les champs non vides
      const filteredData = filterEmptyFields(data);
      
      console.log('Données filtrées à envoyer:', filteredData);

      await updateUser(filteredData as UserRequest);

      // Upload de l'avatar si modifié
      if (selectedAvatar) {
        await updateAvatar(selectedAvatar);
      }

      // Upload du CV si modifié
      if (selectedResume) {
        await updateResume(selectedResume);
      }

      toast.success('Profil mis à jour avec succès');
      setSelectedAvatar(null);
      setSelectedResume(null);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !user) {
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
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>
        <Badge variant={user?.role?.toString() === 'ADMIN' ? 'default' : 'secondary'}>
          {user?.role?.toString() === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Nom */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Votre nom complet"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Titre */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Titre professionnel
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>

                {/* Sous-titre */}
                <div className="space-y-2">
                  <label htmlFor="subtitle" className="text-sm font-medium">
                    Sous-titre
                  </label>
                  <input
                    id="subtitle"
                    type="text"
                    {...register('subtitle')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Ex: Passionné par les nouvelles technologies"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Biographie
                  </label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Localisation */}
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Localisation
                  </label>
                  <input
                    id="location"
                    type="text"
                    {...register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Paris, France"
                  />
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Nouveau mot de passe (optionnel)
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Laissez vide pour conserver l'actuel"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Réseaux sociaux */}
            <Card>
              <CardHeader>
                <CardTitle>Réseaux sociaux & Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Site web */}
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Site web
                  </label>
                  <input
                    id="website"
                    type="url"
                    {...register('website')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="https://monsite.com"
                  />
                  {errors.website && (
                    <p className="text-sm text-red-600">{errors.website.message}</p>
                  )}
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    {...register('linkedin')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="https://linkedin.com/in/monprofil"
                  />
                  {errors.linkedin && (
                    <p className="text-sm text-red-600">{errors.linkedin.message}</p>
                  )}
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label htmlFor="github" className="text-sm font-medium flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </label>
                  <input
                    id="github"
                    type="url"
                    {...register('github')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="https://github.com/monprofil"
                  />
                  {errors.github && (
                    <p className="text-sm text-red-600">{errors.github.message}</p>
                  )}
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    {...register('twitter')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="https://twitter.com/monprofil"
                  />
                  {errors.twitter && (
                    <p className="text-sm text-red-600">{errors.twitter.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photo de profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Aperçu de l'avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    {avatarPreview ? (
                      <Image
                        width={128}
                        height={128}
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {selectedAvatar && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveAvatar}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Upload de fichier */}
                <div className="space-y-2">
                  <Input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {avatarPreview ? 'Changer la photo' : 'Ajouter une photo'}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    JPG, PNG (max 5MB)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CV */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  CV (PDF)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.resumeUrl && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm font-medium">CV actuel</p>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-blue-600"
                      onClick={() => window.open(user.resumeUrl, '_blank')}
                    >
                      Voir le CV
                    </Button>
                  </div>
                )}

                {/* Upload de CV */}
                <div className="space-y-2">
                  <Input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => resumeInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {selectedResume ? 'CV sélectionné' : 'Uploader un CV'}
                  </Button>
                  {selectedResume && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <span className="text-sm text-blue-700 dark:text-blue-300 truncate">
                        {selectedResume.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveResume}
                        className="h-6 w-6 text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    PDF uniquement (max 10MB)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder les modifications
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}