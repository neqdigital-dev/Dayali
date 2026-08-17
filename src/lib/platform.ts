/**
 * Platform detection utilities
 */
export const isTauri = (): boolean =>
  typeof window !== 'undefined' && '__TAURI__' in window;

export const isWeb = (): boolean => !isTauri();

export const getPlatform = (): 'tauri' | 'web' => (isTauri() ? 'tauri' : 'web');
