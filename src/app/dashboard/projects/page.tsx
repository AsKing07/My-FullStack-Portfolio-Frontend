// src/app/dashboard/projects/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";

import { Table } from "@radix-ui/themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card_component";
import { Button } from "@/components/ui/button_component";
import { Input } from "@/components/ui/form/input_component";
import { Badge } from "@/components/ui/badge_component";
import { DropdownMenu } from "@radix-ui/themes";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  Star,
} from "lucide-react";
import { Checkbox } from "@radix-ui/themes";
import { useToast } from "@/hooks/useToast";

import { Project } from "@/types/Project/Project";
import { ProjectRequest } from "@/types/Project/ProjectRequest";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Project>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const {
    projects,
    loading,
    error,
    fetchProjects: refetch,
    deleteProject,
    deleteProjects,
    updateProject,
  } = useProjects();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects?.map((project) => project.id) || []);
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects((prev) => [...prev, projectId]);
    } else {
      setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
    }
  };

  const handleDelete = async (projectId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteProject(projectId);

        if (!error) {
          toast.success("Projet supprimé avec succès");
        } else {
          toast.error("Erreur lors de la suppression du projet");
        }
      } catch (error) {
        toast.error("Erreur lors de la suppression du projet");
      }
    }
  };

  const handleToggleFeatured = async (project: Project, featured: boolean) => {
    try {
      const projectR: ProjectRequest = {
        ...project,
        featured: !featured,
      };
      await updateProject(project.id, projectR);
      if (!error) {
        toast.success(
          `Le projet a été ${
            featured ? "retiré des" : "ajouté aux"
          } projets mis en avant`
        );
      } else {
        toast.error("Erreur lors de la mise à jour du projet");
      }

      refetch();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) return;

    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer ${selectedProjects.length} projet(s) ?`
      )
    ) {
      try {
        await deleteProjects(selectedProjects);
        if (!error) {
          toast.success(
            `${selectedProjects.length} projet(s) supprimé(s) avec succès`
          );

          setSelectedProjects([]);
          refetch();
        } else {
          toast.error("Erreur lors de la suppression des projets");
        }
      } catch (error) {
        toast.error("Erreur lors de la suppression des projets");
      }
    }
  };

  // Extraire toutes les catégories uniques par id
  const categories = projects
    ? Array.from(
        new Map(
          projects
            .map((project) => project.category)
            .filter(Boolean)
            .map((category) => [category?.id, category])
        ).values()
      )
    : [];

  const filteredProjects =
    projects?.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !categoryFilter || project.category?.name === categoryFilter;

      return matchesSearch && matchesCategory;
    }) || [];

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (sortDirection === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }

    if (sortDirection === "asc") {
      if (aValue === undefined) return -1;
      if (bValue === undefined) return 1;
      return aValue > bValue ? 1 : -1;
    } else {
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Gestion des Projets
        </h2>
        <Button onClick={() => router.push("/dashboard/projects/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projets du Portfolio</CardTitle>
          <CardDescription>
            Gérez vos projets, modifiez ou supprimez du contenu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher des projets..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {selectedProjects.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={loading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer ({selectedProjects.length})
                </Button>
              )}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    {categoryFilter || "Toutes les catégories"}
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item onClick={() => setCategoryFilter(null)}>
                    Toutes les catégories
                  </DropdownMenu.Item>
                  {categories.map((category) => (
                    <DropdownMenu.Item
                      key={category?.id}
                      onClick={() => setCategoryFilter(category?.name ?? null)}
                    >
                      {category?.name}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center p-6 text-red-500">
              Une erreur est survenue lors du chargement des projets
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              Aucun projet trouvé
            </div>
          ) : (
            <div className="rounded-md border">
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Cell className="w-12">
                      <Checkbox
                        checked={
                          selectedProjects.length > 0 &&
                          selectedProjects.length === filteredProjects.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </Table.Cell>
                    <Table.Cell className="w-16"></Table.Cell>
                    <Table.Cell
                      className="cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Titre
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </Table.Cell>
                    <Table.Cell>Catégorie</Table.Cell>
                    <Table.Cell
                      className="cursor-pointer"
                      onClick={() => handleSort("startDate")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </Table.Cell>
                    <Table.Cell>Technologies</Table.Cell>
                    <Table.Cell>Statut</Table.Cell>
                    <Table.Cell className="text-right">Actions</Table.Cell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedProjects.map((project) => (
                    <Table.Row key={project.id}>
                      <Table.Cell>
                        <Checkbox
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProject(project.id, checked as boolean)
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {project.image && (
                          <div className="h-12 w-12 overflow-hidden rounded">
                            <Image
                              width={48}
                              height={48}
                              src={project.image}
                              alt={project.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {project.description}
                            </div>
                          </div>
                          {project.featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{project.category?.name}</Table.Cell>
                      <Table.Cell>
                        {project.startDate && formatDate(project.startDate)}
                        {project.endDate && ` - ${formatDate(project.endDate)}`}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies &&
                            project.technologies
                              .split(",")
                              .slice(0, 2)
                              .map((tech) => (
                                <Badge
                                  key={tech.trim()}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tech.trim()}
                                </Badge>
                              ))}

                          {project.technologies &&
                            project.technologies.split(",").length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.technologies.split(",").length - 2}
                              </Badge>
                            )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          variant={
                            project.status === "PUBLISHED" ||
                            project.status === "COMPLETED"
                              ? "default"
                              : project.status === "DRAFT" ||
                                project.status === "PLANNED"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status === "PUBLISHED" && "Publié"}
                          {project.status === "DRAFT" && "Brouillon"}
                          {project.status === "ARCHIVED" && "Archivé"}
                          {project.status === "IN_PROGRESS" && "En cours"}
                          {project.status === "PLANNED" && "Prévu"}
                          {project.status === "COMPLETED" && "Terminé"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-right">
                        <DropdownMenu.Root
                          open={openMenuId === project.id}
                          onOpenChange={(open) =>
                            setOpenMenuId(open ? project.id : null)
                          }
                        >
                          <DropdownMenu.Trigger>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content align="end">
                            <DropdownMenu.Item
                              onSelect={() => {
                                setOpenMenuId(null); // ferme le menu
                                router.push(
                                  `/dashboard/projects/${project.slug}`
                                );
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() => {
                                setOpenMenuId(null); // ferme le menu
                                router.push(
                                  `/dashboard/projects/${project.slug}`
                                );
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onSelect={() =>
                                handleToggleFeatured(
                                  project,
                                  project.featured || false
                                )
                              }
                            >
                              <Star className="mr-2 h-4 w-4" />
                              {project.featured
                                ? "Retirer des favoris"
                                : "Mettre en avant"}
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="text-red-600"
                              onSelect={() => handleDelete(project.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Root>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
