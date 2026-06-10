/**
 * CrimeVision AI — API Key Manager
 * Handles API key retrieval for both Gemini and Anthropic (Claude),
 * falling back to localStorage if env is not defined (crucial for GitHub Pages).
 */

export function getAnthropicApiKey(): string {
  return '';
}

export function setAnthropicApiKey(key: string): void {
  // Client-side Anthropic API key storage is disabled for security
}

export function clearAnthropicApiKey(): void {
  // Disabled
}

export function hasAnthropicApiKey(): boolean {
  return false;
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

export function getActiveProvider(): 'gemini' | 'anthropic' {
  if (hasGeminiApiKey()) return 'gemini';
  return 'anthropic';
}

export function getActiveApiKey(): string {
  const provider = getActiveProvider();
  if (provider === 'gemini') return getGeminiApiKey();
  return '';
}

export function hasAnyApiKey(): boolean {
  // Since Anthropic uses the secure serverless proxy, we always have a provider available
  return true;
}
