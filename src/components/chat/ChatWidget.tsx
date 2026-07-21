'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button_component';
import { cn } from '@/lib/utils';
import { streamChatMessage, ChatbotAdminService, ChatMessage } from '@/services/chatbot.service';

// Le modèle répond parfois avec une mise en forme Markdown (**gras**, # titres, listes à
// tirets) malgré la consigne du prompt système. La bulle de chat affiche du texte brut
// (pas de rendu Markdown), donc on nettoie ces marqueurs plutôt que de dépendre du modèle.
const stripBasicMarkdown = (text: string): string =>
  text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^[-*]\s+/gm, '');

export function ChatWidget() {
  const t = useTranslations('Chatbot');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ChatbotAdminService.getStatus()
      .then((res) => setIsEnabled(res.data.items.enabled))
      .catch(() => setIsEnabled(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);
    setError(null);

    try {
      await streamChatMessage(nextMessages, (delta) => {
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
      setError(err instanceof Error ? err.message : t('error'));
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, t]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="mb-4 w-[min(90vw,380px)] h-[min(70vh,520px)] flex flex-col rounded-2xl border bg-background shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
            <div>
              <p className="font-semibold">{t('title')}</p>
              <p className="text-xs opacity-80">{t('subtitle')}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20"
              onClick={() => setIsOpen(false)}
              aria-label={t('close')}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">{t('welcome')}</p>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'mr-auto bg-muted'
                )}
              >
                {message.content ? stripBasicMarkdown(message.content) : (isStreaming && index === messages.length - 1 ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : '')}
              </div>
            ))}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('inputPlaceholder')}
              disabled={isStreaming}
              maxLength={800}
              className="flex-1 rounded-full border px-4 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="icon"
              className="rounded-full flex-shrink-0"
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              aria-label={t('send')}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        size="icon"
        className="w-14 h-14 rounded-full shadow-xl"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t('close') : t('open')}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </div>
  );
}
