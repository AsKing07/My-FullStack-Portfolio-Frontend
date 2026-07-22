import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { useAuthStore } from '@/stores/auth_store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type BlogDraftStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED';

export interface BlogDraftListItem {
  id: string;
  title: string;
  titleFr: string | null;
  excerpt: string | null;
  status: BlogDraftStatus;
  createdAt: string;
}

export interface BlogAgentTraceEntry {
  tool: string;
  input?: unknown;
  summary: string;
}

export interface BlogDraftDetail extends BlogDraftListItem {
  excerptFr: string | null;
  content: string;
  contentFr: string | null;
  sourcesSummary: string | null;
  toolTrace: BlogAgentTraceEntry[];
  updatedAt: string;
}

export interface BlogAgentUsageEntry {
  id: string;
  kind: 'GENERATION' | 'CONSULT';
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  estimatedCost: number;
  createdAt: string;
  draftId: string | null;
}

export interface BlogAgentUsageStats {
  totalMessages: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheReadTokens: number;
  totalCacheCreationTokens: number;
  totalCost: number;
  last30DaysCost: number;
  recent: BlogAgentUsageEntry[];
}

export interface ConsultMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const BlogAgentService = {
  generate: async (): Promise<ApiResponse<{ id: string; title: string }>> =>
    (await apiClient.post('/blog-agent/generate')).data,

  getDrafts: async (): Promise<ApiResponse<BlogDraftListItem[]>> =>
    (await apiClient.get('/blog-agent/drafts')).data,

  getDraft: async (id: string): Promise<ApiResponse<BlogDraftDetail>> =>
    (await apiClient.get(`/blog-agent/drafts/${id}`)).data,

  getStatus: async (): Promise<ApiResponse<{ enabled: boolean }>> =>
    (await apiClient.get('/blog-agent/status')).data,

  setEnabled: async (enabled: boolean): Promise<ApiResponse<{ enabled: boolean }>> =>
    (await apiClient.patch('/blog-agent/status', { enabled })).data,

  updateDraftStatus: async (id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<ApiResponse<BlogDraftDetail>> =>
    (await apiClient.patch(`/blog-agent/drafts/${id}`, { status })).data,

  getUsage: async (): Promise<ApiResponse<BlogAgentUsageStats>> =>
    (await apiClient.get('/blog-agent/usage')).data,
};

/**
 * Consulte l'agent en direct (chat interactif dans le dashboard) et streame la
 * réponse token par token via SSE, sur le même principe que le chatbot public.
 */
export async function streamConsultMessage(
  messages: ConsultMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const { token } = useAuthStore.getState();

  const response = await fetch(`${API_BASE_URL}/blog-agent/consult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erreur de l'agent (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = JSON.parse(line.slice(6));
      if (payload.error) throw new Error(payload.error);
      if (payload.delta) onDelta(payload.delta);
    }
  }
}
