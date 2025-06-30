"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCategory } from "@/hooks/useCategory";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_component";
import { Input } from "@/components/ui/form/input_component";
import { TextArea } from "@radix-ui/themes";
import { Button } from "@/components/ui/button_component";
import { Tabs } from "@radix-ui/themes";
import { Select } from "@radix-ui/themes";
import { Checkbox } from "@radix-ui/themes";
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectRequest } from "@/types/Project/ProjectRequest";
import "@radix-ui/themes/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "radix-themes-datepicker-styles";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading_spinner";

import { TextField } from "@radix-ui/themes";
import DatePicker from "react-datepicker";

const formSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  content: z.string().optional(),
  status: z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
    "IN_PROGRESS",
    "PLANNED",
    "COMPLETED",
  ]),
  featured: z.boolean().optional(),
  liveUrl: z.string().url("URL du site invalide").optional().or(z.literal("")),
  githubUrl: z.string().url("URL GitHub invalide").optional().or(z.literal("")),
  figmaUrl: z.string().url("URL Figma invalide").optional().or(z.literal("")),
  image: z.string().min(1, "L'image principale est requise"),
  gallery: z.array(z.string()).optional(),
  technologies: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProjectCreatePage() {
  //
  const { categories, loading: loadingCategory } = useCategory();
  const router = useRouter();
  const { createProject, saveProjectImages, loading, error } = useProjects();

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "COMPLETED",
      featured: false,
      liveUrl: "",
      githubUrl: "",
      figmaUrl: "",
      image: "",
      gallery: [],
      technologies: "",
      startDate: undefined,
      endDate: undefined,
      categoryId: "",
    },
  });

  // Gestion upload image principale
  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setMainImageFile(file);
      // Upload vers API
      const urls = await saveProjectImages(file);

      if (urls) {
        if (Array.isArray(urls)) {
          setMainImageUrl(urls[0]);
          form.setValue("image", urls[0]);
        } else {
          setMainImageUrl(urls);
          form.setValue("image", urls);
        }
      }
      toast.success("Image principale téléchargée avec succès");
    } catch (error) {
      toast.error(
        `Erreur lors du téléchargement de l\'image principale ` +
          (error instanceof Error ? error.message : "")
      );
    }
  };

  // Gestion upload galerie
  const handleGalleryChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      setGalleryFiles((prev) => [...prev, ...files]);
      // Upload vers API
      const urls = await saveProjectImages(files);
      if (urls && urls.length > 0) {
        setGalleryUrls((prev) => [...prev, ...urls]);
        form.setValue("gallery", [
          ...(form.getValues("gallery") || []),
          ...urls,
        ]);
      }
    } catch (error) {
      toast.error(
        `Erreur lors du téléchargement de la galerie ` +
          (error instanceof Error ? error.message : "")
      );
    }
  };

  // Suppression image galerie
  const handleRemoveGalleryImage = (index: number) => {
    const newUrls = [...galleryUrls];
    newUrls.splice(index, 1);
    setGalleryUrls(newUrls);
    form.setValue("gallery", newUrls);
  };

  // Mapping de status pour correspondre à ProjectStatus
  const statusMap: Record<string, string> = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
    IN_PROGRESS: "IN_PROGRESS",
    PLANNED: "PLANNED",
    COMPLETED: "COMPLETED",
  };

  // Soumission du formulaire
  const onSubmit = async (values: FormValues) => {
    try {
      const payload: ProjectRequest = {
        ...values,
        status: statusMap[values.status] as ProjectRequest["status"],
        gallery: (values.gallery || []).join(","),
        technologies: values.technologies,
      };
      await createProject(payload);

      if (!error) {
        toast.success("Projet créé avec succès");
        router.push("/dashboard/projects");
      } else {
        toast.error(`Erreur lors de la création du projet` + error  );
      }
    } catch (err: any) {
      toast.error("Erreur lors de la création du projet");
    }
  };

  if (loadingCategory) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto">
          <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/projects")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Nouveau projet</h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs.Root defaultValue="general" className="w-full">
          <Tabs.List className="mb-4">
            <Tabs.Trigger value="general">Général</Tabs.Trigger>
            <Tabs.Trigger value="details">Détails</Tabs.Trigger>
            <Tabs.Trigger value="media">Media</Tabs.Trigger>
            <Tabs.Trigger value="links">Liens</Tabs.Trigger>
          </Tabs.List>

          {/* Général */}
          <Tabs.Content value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="font-semibold">Titre</label>
                  <Input
                    {...form.register("title")}
                    placeholder="Titre du projet"
                  />
                  <small className="text-muted-foreground">
                    Le slug sera généré automatiquement.
                  </small>
                </div>
                <div>
                  <label className="font-semibold">Description courte</label>
                  <TextArea
                    {...form.register("description")}
                    rows={3}
                    placeholder="Brève description"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Catégorie</label>
                  <Select.Root
                    value={form.watch("categoryId")}
                    onValueChange={(val: string) =>
                      form.setValue("categoryId", val)
                    }
                  >
                    <Select.Trigger
                      placeholder={
                        form.getValues("categoryId") ||
                        "Sélectionner une catégorie"
                      }
                    />

                    <Select.Content>
                      {categories &&
                        categories.map((category) => (
                          <Select.Item key={category.id} value={category.id}>
                            {category.name}
                          </Select.Item>
                        ))}
                    </Select.Content>
                  </Select.Root>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={form.watch("featured")}
                    onCheckedChange={(val: boolean | "indeterminate") =>
                      form.setValue("featured", !!val)
                    }
                  />
                  <span>Mettre en avant</span>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* Détails */}
          <Tabs.Content value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="font-semibold">Description détaillée</label>
                  <TextArea
                    {...form.register("content")}
                    rows={6}
                    placeholder="Description détaillée"
                  />
                </div>
                <div>
                  <label className="font-semibold">
                    Technologies (séparées par des virgules)
                  </label>
                  <Input
                    {...form.register("technologies")}
                    placeholder="ex: React, Node.js, Tailwind"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Date de début</label>
                    <DatePicker
                      selected={form.watch("startDate") || null}
                      showPopperArrow={true}
                      popperPlacement="bottom-start"
                      customInput={<TextField.Root />}
                      placeholderText="Sélectionner une date"
                      onChange={(date: Date | null) =>
                        form.setValue("startDate", date || undefined)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Date de fin</label>
                    <DatePicker
                      selected={form.watch("endDate") || null}
                      showPopperArrow={true}
                      popperPlacement="bottom-start"
                      customInput={<TextField.Root />}
                      placeholderText="Sélectionner une date"
                      onChange={(date: Date | null) =>
                        form.setValue("endDate", date || undefined)
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">Statut</label>
                  <Select.Root
                    value={form.watch("status")}
                    onValueChange={(val: string) =>
                      form.setValue("status", val as any)
                    }
                  >
                    <Select.Trigger
                      placeholder={
                        form.getValues("status") || "Sélectionner un statut"
                      }
                    />

                    <Select.Content>
                      <Select.Item value="COMPLETED">Terminé</Select.Item>
                      <Select.Item value="IN_PROGRESS">En cours</Select.Item>
                      <Select.Item value="PLANNED">Planifié</Select.Item>
                      <Select.Item value="ARCHIVED">Archivé</Select.Item>
                      <Select.Item value="DRAFT">Brouillon</Select.Item>
                      <Select.Item value="PUBLISHED">Publié</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* Media */}
          <Tabs.Content value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image principale
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                  />
                  {mainImageUrl && (
                    <div className="mt-2">
                      <Image
                        src={mainImageUrl}
                        alt={mainImageUrl}
                        className="rounded-lg max-h-48"
                        width={320}
                        height={192}
                        style={{
                          objectFit: "cover",
                          maxHeight: "12rem",
                          width: "auto",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Galerie d'images
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {galleryUrls.map((url, i) => (
                      <div key={url} className="relative group">
                        <Image
                          width={320}
                          height={192}
                          src={url}
                          alt={`Galerie ${i + 1}`}
                          className="rounded-lg h-20 w-32 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100"
                          onClick={() => handleRemoveGalleryImage(i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* Liens */}
          <Tabs.Content value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Liens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Lien du site en ligne
                  </label>
                  <Input
                    {...form.register("liveUrl")}
                    placeholder="https://exemple.com"
                  />
                </div>
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Lien GitHub
                  </label>
                  <Input
                    {...form.register("githubUrl")}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="font-semibold flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Lien Figma
                  </label>
                  <Input
                    {...form.register("figmaUrl")}
                    placeholder="https://figma.com/..."
                  />
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>
        </Tabs.Root>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
