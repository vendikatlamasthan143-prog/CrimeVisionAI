/**
 * CrimeVision AI — AI Intelligence Service
 * Handles unified browser-side API calls to Gemini and Anthropic (Claude)
 * with real-time text streaming support.
 */

import { getActiveProvider, getActiveApiKey } from './apiKey';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateTextStream(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const provider = getActiveProvider();
  const apiKey = getActiveApiKey();

  if (!provider || !apiKey) {
    throw new Error('AI API Key not configured. Please enter your key in the settings.');
  }

  if (provider === 'gemini') {
    return runGeminiStream(apiKey, params);
  } else {
    return runAnthropicStream(apiKey, params);
  }
}

// ── Gemini REST Streaming Implementation ──────────────────────────────────────
async function runGeminiStream(
  apiKey: string,
  params: { systemPrompt?: string; messages: ChatMessage[]; onChunk: (text: string) => void; signal?: AbortSignal }
): Promise<string> {
  const { systemPrompt, messages, onChunk, signal } = params;

  // Format messages to Gemini API format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body: any = {
    contents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.2,
    }
  };

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  // Use alt=sse for standard server-sent events stream format
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API Error ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last partial line in the buffer

      for (const line of lines) {
        const cleaned = line.trim();
        if (cleaned.startsWith('data: ')) {
          const jsonStr = cleaned.slice(6).trim();
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textChunk) {
              fullText += textChunk;
              onChunk(textChunk);
            }
          } catch {
            // Ignore incomplete chunks or parse errors
          }
        }
      }
    }
  }

  // Handle final residue in buffer
  if (buffer) {
    const cleaned = buffer.trim();
    if (cleaned.startsWith('data: ')) {
      const jsonStr = cleaned.slice(6).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (textChunk) {
          fullText += textChunk;
          onChunk(textChunk);
        }
      } catch {
        // ignore
      }
    }
  }

  return fullText || 'No response generated.';
}

// ── Anthropic REST Streaming Implementation ───────────────────────────────────
async function runAnthropicStream(
  apiKey: string,
  params: { systemPrompt?: string; messages: ChatMessage[]; onChunk: (text: string) => void; signal?: AbortSignal }
): Promise<string> {
  const { systemPrompt, messages, onChunk, signal } = params;

  const body: any = {
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Claude API Error ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]' || data === '') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              const deltaText = parsed.delta.text;
              fullText += deltaText;
              onChunk(deltaText);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    }
  }

  return fullText;
}

// ── Non-streaming Helper (For Predictions/Heatmaps/FIRs) ────────────────────────
export async function generateText(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
}): Promise<string> {
  const provider = getActiveProvider();
  const apiKey = getActiveApiKey();

  if (!provider || !apiKey) {
    throw new Error('AI API Key not configured.');
  }

  if (provider === 'gemini') {
    const contents = params.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const body: any = {
      contents,
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0.1,
      }
    };
    
    if (params.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: params.systemPrompt }]
      };
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini Error ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else {
    // Anthropic
    const body: any = {
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: params.messages.map(m => ({ role: m.role, content: m.content })),
    };
    
    if (params.systemPrompt) {
      body.system = params.systemPrompt;
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Claude Error ${response.status}`);
    }
    
    const data = await response.json();
    return data.content?.[0]?.text || '';
  }
}
