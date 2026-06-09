/**
 * CrimeVision AI — API Key Manager
 * Handles API key retrieval for both Gemini and Anthropic (Claude),
 * falling back to localStorage if env is not defined (crucial for GitHub Pages).
 */

export function getAnthropicApiKey(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
  }
  const envKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
  const localKey = localStorage.getItem('ksp_anthropic_api_key') || '';
  return (envKey || localKey).trim();
}

export function setAnthropicApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ksp_anthropic_api_key', key.trim());
  }
}

export function clearAnthropicApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ksp_anthropic_api_key');
  }
}

export function hasAnthropicApiKey(): boolean {
  return !!getAnthropicApiKey();
}

export function getGeminiApiKey(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }
  const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const localKey = localStorage.getItem('ksp_gemini_api_key') || '';
  return (envKey || localKey).trim();
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ksp_gemini_api_key', key.trim());
  }
}

export function clearGeminiApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ksp_gemini_api_key');
  }
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey();
}

export function getActiveProvider(): 'gemini' | 'anthropic' | null {
  if (hasGeminiApiKey()) return 'gemini';
  if (hasAnthropicApiKey()) return 'anthropic';
  return null;
}

export function getActiveApiKey(): string {
  const provider = getActiveProvider();
  if (provider === 'gemini') return getGeminiApiKey();
  if (provider === 'anthropic') return getAnthropicApiKey();
  return '';
}

export function hasAnyApiKey(): boolean {
  return getActiveProvider() !== null;
}
