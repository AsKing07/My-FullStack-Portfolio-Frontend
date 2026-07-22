'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Switch } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { Bot, Coins, Database, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { BlogAgentService, BlogDraftListItem, BlogAgentUsageStats } from '@/services/blogAgent.service';

const formatCost = (value: number) => `$${value.toFixed(4)}`;
const formatTokens = (value: number) => value.toLocaleString('en-US');

const statusLabel: Record<string, string> = {
  PROPOSED: 'Proposé',
  ACCEPTED: 'Accepté',
  REJECTED: 'Rejeté',
};

const statusColor: Record<string, string> = {
  PROPOSED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function BlogAgentDashboardPage() {
  const [drafts, setDrafts] = useState<BlogDraftListItem[]>([]);
  const [stats, setStats] = useState<BlogAgentUsageStats | null>(null);
  const [cronEnabled, setCronEnabled] = useState(true);
  const [updatingCron, setUpdatingCron] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    try {
      const [draftsRes, usageRes, statusRes] = await Promise.all([
        BlogAgentService.getDrafts(),
        BlogAgentService.getUsage(),
        BlogAgentService.getStatus(),
      ]);
      setDrafts(draftsRes.data.items);
      setStats(usageRes.data.items);
      setCronEnabled(statusRes.data.items.enabled);
    } catch (err) {
      toast.error('Erreur lors du chargement des données de l\'agent');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCron = async (checked: boolean) => {
    setUpdatingCron(true);
    try {
      const res = await BlogAgentService.setEnabled(checked);
      setCronEnabled(res.data.items.enabled);
      toast.success(checked ? 'Génération automatique activée' : 'Génération automatique désactivée');
    } catch (err) {
      toast.error(`Erreur : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setUpdatingCron(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await BlogAgentService.generate();
      toast.success(`Nouveau brouillon proposé : "${res.data.items.title}"`);
      await load();
    } catch (err) {
      toast.error(`Erreur : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Agent de rédaction du blog
        </h1>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer maintenant
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Génération automatique {cronEnabled ? 'activée' : 'désactivée'}
              </p>
              <p className="text-sm text-muted-foreground">
                Quand activée, un nouveau brouillon est proposé automatiquement toutes les deux semaines.
              </p>
            </div>
            <Switch checked={cronEnabled} onCheckedChange={handleToggleCron} disabled={updatingCron} size="3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût total estimé</p>
                <p className="text-2xl font-bold">{formatCost(stats?.totalCost ?? 0)}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coût (30 derniers jours)</p>
                <p className="text-2xl font-bold">{formatCost(stats?.last30DaysCost ?? 0)}</p>
              </div>
              <Coins className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tokens (in / out)</p>
                <p className="text-lg font-bold">
                  {formatTokens(stats?.totalInputTokens ?? 0)} / {formatTokens(stats?.totalOutputTokens ?? 0)}
                </p>
              </div>
              <Database className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appels enregistrés</p>
                <p className="text-2xl font-bold">{stats?.totalMessages ?? 0}</p>
              </div>
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brouillons proposés</CardTitle>
        </CardHeader>
        <CardContent>
          {!drafts.length ? (
            <p className="text-muted-foreground">
              Aucun brouillon pour le moment. L&apos;agent en génère un automatiquement toutes les deux semaines,
              ou cliquez sur &quot;Générer maintenant&quot;.
            </p>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <Link
                  key={draft.id}
                  href={`/dashboard/blog-agent/${draft.id}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{draft.title}</p>
                    {draft.excerpt && <p className="text-sm text-muted-foreground line-clamp-1">{draft.excerpt}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(draft.createdAt)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[draft.status]}`}>
                    {statusLabel[draft.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
