'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Button } from '@/components/ui/button_component';
import { LoadingSpinner } from '@/components/ui/loading_spinner';
import { ArrowLeft, Check, X, Send, Loader2, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import {
  BlogAgentService,
  BlogDraftDetail,
  streamConsultMessage,
  ConsultMessage,
} from '@/services/blogAgent.service';

const statusLabel: Record<string, string> = {
  PROPOSED: 'Proposé',
  ACCEPTED: 'Accepté',
  REJECTED: 'Rejeté',
};

export default function BlogAgentDraftPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [draft, setDraft] = useState<BlogDraftDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [messages, setMessages] = useState<ConsultMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    BlogAgentService.getDraft(id)
      .then((res) => setDraft(res.data.items))
      .catch(() => toast.error('Erreur lors du chargement du brouillon'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAccept = async () => {
    setUpdating(true);
    try {
      await BlogAgentService.updateDraftStatus(id, 'ACCEPTED');
      const params = new URLSearchParams({
        draftId: id,
        title: draft?.title || '',
        titleFr: draft?.titleFr || '',
        excerpt: draft?.excerpt || '',
        excerptFr: draft?.excerptFr || '',
        content: draft?.content || '',
        contentFr: draft?.contentFr || '',
      });
      router.push(`/dashboard/blog/new?${params.toString()}`);
    } catch (err) {
      toast.error('Erreur lors de l\'acceptation du brouillon');
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    setUpdating(true);
    try {
      const res = await BlogAgentService.updateDraftStatus(id, 'REJECTED');
      setDraft(res.data.items);
      toast.success('Brouillon rejeté');
    } catch (err) {
      toast.error('Erreur lors du rejet du brouillon');
    } finally {
      setUpdating(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: ConsultMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);

    try {
      await streamConsultMessage(nextMessages, (delta) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + delta,
          };
          return updated;
        });
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la consultation de l\'agent');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Chargement...</div>;
  }

  if (!draft) {
    return <div className="p-8 text-muted-foreground">Brouillon introuvable.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/dashboard/blog-agent')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        {draft.status === 'PROPOSED' && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReject} disabled={updating}>
              <X className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
            <Button onClick={handleAccept} disabled={updating}>
              <Check className="mr-2 h-4 w-4" />
              Accepter et éditer
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{draft.title}</CardTitle>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                  {statusLabel[draft.status]}
                </span>
              </div>
              {draft.titleFr && <p className="text-sm text-muted-foreground">{draft.titleFr}</p>}
              <p className="text-xs text-muted-foreground">{formatDate(draft.createdAt)}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {draft.sourcesSummary && (
                <div className="text-sm bg-muted/50 border rounded-md p-3">
                  <p className="font-medium mb-1">Pourquoi ce sujet ?</p>
                  <p className="text-muted-foreground">{draft.sourcesSummary}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Contenu (EN)</h3>
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm border rounded-md p-4">
                  {draft.content}
                </div>
              </div>

              {draft.contentFr && (
                <div>
                  <h3 className="font-medium mb-2">Contenu (FR)</h3>
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm border rounded-md p-4">
                    {draft.contentFr}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="w-4 h-4" />
                Trace des outils utilisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!draft.toolTrace.length ? (
                <p className="text-muted-foreground text-sm">Aucune trace disponible.</p>
              ) : (
                <ol className="space-y-2 text-sm">
                  {draft.toolTrace.map((entry, index) => (
                    <li key={index} className="border-l-2 pl-3">
                      <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{entry.tool}</span>
                      <span className="text-muted-foreground ml-2">{entry.summary}</span>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle className="text-base">Consulter l&apos;agent</CardTitle>
              <p className="text-xs text-muted-foreground">
                Demandez-lui pourquoi il a proposé ce sujet, ou de réviser le contenu.
              </p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun message pour l&apos;instant.</p>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      message.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted'
                    }`}
                  >
                    {message.content || (isStreaming && index === messages.length - 1 ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : '')}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Votre message..."
                  disabled={isStreaming}
                  className="flex-1 rounded-full border px-4 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button
                  size="icon"
                  className="rounded-full flex-shrink-0"
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
