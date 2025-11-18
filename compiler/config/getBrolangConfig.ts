import { defaultConfig, BrolangConfig } from './defaultConfig';

export function getBrolangConfig(): BrolangConfig {
  if (typeof window === 'undefined') {
    // Server-side, return default
    return defaultConfig;
  }
  const stored = localStorage.getItem('brolangConfig');
  if (!stored) {
    return defaultConfig;
  }
  try {
    const parsed = JSON.parse(stored);
    // Deep merge: merge nested objects properly
    return {
      tokens: {
        keywords: { ...defaultConfig.tokens.keywords, ...(parsed.tokens?.keywords || {}) }
      },
      syntax: {
        precedences: { ...defaultConfig.syntax.precedences, ...(parsed.syntax?.precedences || {}) },
        prefixTokens: parsed.syntax?.prefixTokens || defaultConfig.syntax.prefixTokens,
        infixTokens: parsed.syntax?.infixTokens || defaultConfig.syntax.infixTokens,
      },
      errors: {
        messages: { ...defaultConfig.errors.messages, ...(parsed.errors?.messages || {}) }
      }
    };
  } catch {
    return defaultConfig;
  }
}