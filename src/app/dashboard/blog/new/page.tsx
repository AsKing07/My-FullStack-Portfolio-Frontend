'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { useBlog } from '@/hooks/useBlogPost';
import { useToast } from '@/hooks/useToast';
import { PostStatus } from '@/types/BlogPost/BlogPost';
import { 
  Save, 
  Globe, 
  FileText, 
  Eye, 
  Image as ImageIcon,
  Calendar,
  Clock,
  Hash,
  Star,
  Upload,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/form/input_component';
import { BlogPostRequest } from '@/types/BlogPost/BlogPostRequest';

const blogPostSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  slug: z.string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  status: z.nativeEnum(PostStatus).optional(),
  featured: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  image: z.instanceof(File).optional(),
  readingTime: z.number().min(1).optional(),
  publishedAt: z.date().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function NewBlogPostPage() {
  const router = useRouter();
  const { createBlogPost } = useBlog();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: PostStatus.DRAFT,
      featured: false,
      readingTime: 1,
    },
  });

  const titleValue = watch('title');
  const contentValue = watch('content');
  const statusValue = watch('status');
  const imageFile = watch('image');

  // Génération automatique du slug basé sur le titre
  const generateSlug = (title: string) => {
    return title
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

  // Estimation du temps de lecture (moyenne 200 mots/minute)
  const estimateReadingTime = (content: string) => {
    const words = content.split(' ').length;
    return Math.max(1, Math.ceil(words / 200));
  };

  // Mettre à jour le slug et le temps de lecture automatiquement
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('slug', generateSlug(title));
    if (!watch('metaTitle')) {
      setValue('metaTitle', title);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setValue('readingTime', estimateReadingTime(content));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setValue('image', file);
      
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('image', undefined);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    const formData: BlogPostRequest = {
      ...data,
      image: data.image ? data.image : undefined, 
    };
    console.log('Données à envoyer:', formData);
    try {
      await createBlogPost(formData);
      toast.success('Article créé avec succès');
      router.push('/dashboard/blog');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndPublish = async () => {
    const data = watch();
    await onSubmit({ ...data, status: PostStatus.PUBLISHED, publishedAt: new Date() });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvel Article</h1>
          <p className="text-muted-foreground">Créer un nouvel article de blog</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Édition' : 'Aperçu'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/blog')}
          >
            Retour
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Titre */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Titre de l'article *
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title')}
                    onChange={(e) => {
                      register('title').onChange(e);
                      handleTitleChange(e);
                    }}
                    className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Titre de votre article"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Slug *
                  </label>
                  <input
                    id="slug"
                    type="text"
                    {...register('slug')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="slug-de-votre-article"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600">{errors.slug.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    URL de l'article : /blog/{watch('slug') || 'votre-slug'}
                  </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">
                    Résumé
                  </label>
                  <textarea
                    id="excerpt"
                    {...register('excerpt')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Résumé de l'article (optionnel)"
                  />
                </div>

                {/* Contenu */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Contenu *
                  </label>
                  {previewMode ? (
                    <div className="min-h-[400px] p-4 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
                      <div className="prose dark:prose-invert max-w-none">
                        {contentValue ? (
                          <div dangerouslySetInnerHTML={{ __html: contentValue.replace(/\n/g, '<br/>') }} />
                        ) : (
                          <p className="text-muted-foreground italic">Aperçu du contenu...</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      id="content"
                      {...register('content')}
                      onChange={(e) => {
                        register('content').onChange(e);
                        handleContentChange(e);
                      }}
                      rows={20}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 font-mono text-sm"
                      placeholder="Contenu de votre article en Markdown ou HTML..."
                    />
                  )}
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Actions</h3>
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full"
                  variant="outline"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder comme brouillon
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button"
                  onClick={handleSaveAndPublish}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Sauvegarder et publier
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Paramètres */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">Paramètres</h3>
              <div className="space-y-4">
                {/* Statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  >
                    <option value={PostStatus.DRAFT}>Brouillon</option>
                    <option value={PostStatus.PUBLISHED}>Publié</option>
                    <option value={PostStatus.ARCHIVED}>Archivé</option>
                  </select>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Article en vedette
                  </label>
                </div>

                {/* Temps de lecture */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Temps de lecture (minutes)
                  </label>
                  <input
                    type="number"
                    {...register('readingTime', { valueAsNumber: true })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <p className="text-xs text-muted-foreground">
                    Estimation automatique basée sur le contenu
                  </p>
                </div>

                {/* Date de publication */}
                {statusValue === PostStatus.PUBLISHED && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date de publication
                    </label>
                    <input
                      type="datetime-local"
                      {...register('publishedAt', { valueAsDate: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Image de couverture */}
            <Card className="p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image de couverture
              </h3>
              <div className="space-y-3">
                {/* Aperçu de l'image */}
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview}
                      alt="Aperçu" 
                      className="w-full h-32 object-cover rounded-md border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Upload de fichier */}
                <div className="space-y-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Formats acceptés: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>

                {/* Affichage du nom du fichier sélectionné */}
                {imageFile && (
                  <div className="text-sm text-muted-foreground">
                    Fichier sélectionné: {imageFile.name}
                  </div>
                )}
              </div>
            </Card>

            {/* SEO */}
            <Card className="p-4">
              <h3 className="font-medium mb-4">SEO</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Title</label>
                  <input
                    type="text"
                    {...register('metaTitle')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Titre pour les moteurs de recherche"
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch('metaTitle')?.length || 0}/60 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <textarea
                    {...register('metaDesc')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    placeholder="Description pour les moteurs de recherche"
                  />
                  <p className="text-xs text-muted-foreground">
                    {watch('metaDesc')?.length || 0}/160 caractères
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}