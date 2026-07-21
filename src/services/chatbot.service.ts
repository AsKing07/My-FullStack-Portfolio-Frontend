import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotUsageEntry {
  id: string;
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  estimatedCost: number;
  createdAt: string;
}

export interface ChatbotUsageStats {
  totalMessages: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheReadTokens: number;
  totalCacheCreationTokens: number;
  totalCost: number;
  last30DaysCost: number;
  recent: ChatbotUsageEntry[];
}

export const ChatbotAdminService = {
  getStatus: async (): Promise<ApiResponse<{ enabled: boolean }>> =>
    (await apiClient.get('/chatbot/status')).data,

  setEnabled: async (enabled: boolean): Promise<ApiResponse<{ enabled: boolean }>> =>
    (await apiClient.patch('/chatbot/status', { enabled })).data,

  getUsage: async (): Promise<ApiResponse<ChatbotUsageStats>> =>
    (await apiClient.get('/chatbot/usage')).data,
};

/**
 * Envoie l'historique de conversation au chatbot et streame la réponse token par
 * token via SSE. Utilise fetch + ReadableStream plutôt qu'axios, qui ne gère pas
 * nativement les réponses en streaming côté navigateur.
 */
export async function streamChatMessage(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Erreur du chatbot (${response.status})`);
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
