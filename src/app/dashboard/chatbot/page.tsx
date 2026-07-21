'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@radix-ui/themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Bot, MessageSquare, Coins, Database } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { ChatbotAdminService, ChatbotUsageStats } from '@/services/chatbot.service';

const formatCost = (value: number) => `$${value.toFixed(4)}`;
const formatTokens = (value: number) => value.toLocaleString('en-US');

export default function ChatbotDashboardPage() {
  const [enabled, setEnabled] = useState(false);
  const [stats, setStats] = useState<ChatbotUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [statusRes, usageRes] = await Promise.all([
          ChatbotAdminService.getStatus(),
          ChatbotAdminService.getUsage(),
        ]);
        setEnabled(statusRes.data.items.enabled);
        setStats(usageRes.data.items);
      } catch (err) {
        toast.error('Erreur lors du chargement des données du chatbot');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setUpdating(true);
    try {
      const res = await ChatbotAdminService.setEnabled(checked);
      setEnabled(res.data.items.enabled);
      toast.success(checked ? 'Chatbot activé' : 'Chatbot désactivé');
    } catch (err) {
      toast.error(`Erreur : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setUpdating(false);
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
          Chatbot du portfolio
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{enabled ? 'Activé' : 'Désactivé'}</p>
              <p className="text-sm text-muted-foreground">
                Quand désactivé, la bulle de chat disparaît du portfolio public.
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={handleToggle} disabled={updating} size="3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages échangés</p>
                <p className="text-2xl font-bold">{stats?.totalMessages ?? 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Échanges récents</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.recent.length ? (
            <p className="text-muted-foreground">Aucun échange enregistré pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Tokens entrée</th>
                    <th className="py-2 pr-4">Tokens sortie</th>
                    <th className="py-2 pr-4">Cache (lu/écrit)</th>
                    <th className="py-2">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((entry) => (
                    <tr key={entry.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{formatDate(entry.createdAt)}</td>
                      <td className="py-2 pr-4">{formatTokens(entry.inputTokens)}</td>
                      <td className="py-2 pr-4">{formatTokens(entry.outputTokens)}</td>
                      <td className="py-2 pr-4">
                        {formatTokens(entry.cacheReadTokens)} / {formatTokens(entry.cacheCreationTokens)}
                      </td>
                      <td className="py-2">{formatCost(entry.estimatedCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
