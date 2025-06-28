'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/hooks/useBlogPost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Badge } from '@/components/ui/badge_component';
import { Input } from '@/components/ui/form/input_component';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Search, 
  Filter,
  Star,
  Globe,
  FileText,
  Archive
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';
import { PostStatus } from '@/types/BlogPost/BlogPost';

export default function BlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { posts, loading, error, deleteBlogPost, publishBlogPost } = useBlog();
  
  // États pour les filtres
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<'ALL' | 'FEATURED' | 'NORMAL'>('ALL');

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet article ? Cette action est irréversible.')) {
      try {
        await deleteBlogPost(id);
        toast.success('Article supprimé avec succès');
      } catch (err) {
        toast.error(`Erreur lors de la suppression : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishBlogPost(id);
      toast.success('Article publié avec succès');
    } catch (err) {
      toast.error(`Erreur lors de la publication : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return <Badge variant="default" className="flex items-center gap-1"><Globe className="w-3 h-3" />Publié</Badge>;
      case PostStatus.DRAFT:
        return <Badge variant="secondary" className="flex items-center gap-1"><FileText className="w-3 h-3" />Brouillon</Badge>;
      case PostStatus.ARCHIVED:
        return <Badge variant="outline" className="flex items-center gap-1"><Archive className="w-3 h-3" />Archivé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  // Fonction de filtrage des articles
  const filteredPosts = posts.filter(post => {
    // Filtre par statut
    const matchesStatus = statusFilter === 'ALL' || post.status === statusFilter;
    
    // Filtre par featured
    const matchesFeatured = featuredFilter === 'ALL' || 
      (featuredFilter === 'FEATURED' && post.featured) ||
      (featuredFilter === 'NORMAL' && !post.featured);
    
    // Filtre par recherche (titre, excerpt, contenu)
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.metaTitle && post.metaTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesFeatured && matchesSearch;
  });

  const publishedCount = posts.filter(post => post.status === PostStatus.PUBLISHED).length;
  const draftCount = posts.filter(post => post.status === PostStatus.DRAFT).length;
  const featuredCount = posts.filter(post => post.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion du Blog</h1>
          <p className="text-muted-foreground">
            {posts.length} article{posts.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/blog/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Publiés</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <p className="text-2xl font-bold">{draftCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">En vedette</p>
                <p className="text-2xl font-bold">{featuredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section des filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, excerpt, contenu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtres par boutons */}
            <div className="flex flex-wrap gap-4">
              {/* Filtre par statut */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium">Statut:</span>
                <Button
                  variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('ALL')}
                >
                  Tous
                </Button>
                <Button
                  variant={statusFilter === PostStatus.PUBLISHED ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(PostStatus.PUBLISHED)}
                  className="flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  Publiés
                </Button>
                <Button
                  variant={statusFilter === PostStatus.DRAFT ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(PostStatus.DRAFT)}
                  className="flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Brouillons
                </Button>
                <Button
                  variant={statusFilter === PostStatus.ARCHIVED ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(PostStatus.ARCHIVED)}
                  className="flex items-center gap-1"
                >
                  <Archive className="w-3 h-3" />
                  Archivés
                </Button>
              </div>

              {/* Filtre par featured */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium">Type:</span>
                <Button
                  variant={featuredFilter === 'ALL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeaturedFilter('ALL')}
                >
                  Tous
                </Button>
                <Button
                  variant={featuredFilter === 'FEATURED' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeaturedFilter('FEATURED')}
                  className="flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  En vedette
                </Button>
                <Button
                  variant={featuredFilter === 'NORMAL' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFeaturedFilter('NORMAL')}
                >
                  Normaux
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Articles ({filteredPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'ALL' || featuredFilter !== 'ALL' 
                  ? 'Aucun article ne correspond aux filtres.'
                  : 'Aucun article créé pour le moment.'
                }
              </p>
              {!searchQuery && statusFilter === 'ALL' && featuredFilter === 'ALL' && (
                <Button 
                  className="mt-4" 
                  onClick={() => router.push('/dashboard/blog/new')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer le premier article
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((post) => (
                <div 
                  key={post.id} 
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    post.featured ? 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {getStatusBadge(post.status)}
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Non publié'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min de lecture
                        </span>
                        <span>Modifié le {formatDate(post.updatedAt)}</span>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {post.status === PostStatus.PUBLISHED && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          title="Voir l'article"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => router.push(`/dashboard/blog/${post.slug}`)}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {post.status === PostStatus.DRAFT && (
                        <Button 
                          variant="default" 
                          size="icon"
                          onClick={() => handlePublish(post.id)}
                          title="Publier"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}