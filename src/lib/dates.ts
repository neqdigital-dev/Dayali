import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, differenceInDays, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

const TIMEZONE = 'America/Sao_Paulo';

const locales = {
  pt: ptBR,
  en: enUS,
};

type Lang = 'pt' | 'en';

/**
 * Get current date in São Paulo timezone
 */
export function getTodayLocal(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

/**
 * Format a date string for display
 */
export function formatDate(date: string | Date, lang: Lang = 'pt'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: locales[lang] });
}

/**
 * Format date to short display (e.g., "16 ago")
 */
export function formatDateShort(date: string | Date, lang: Lang = 'pt'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMM', { locale: locales[lang] });
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  // time is "HH:mm" or "HH:mm:ss"
  return time.substring(0, 5);
}

/**
 * Get relative day label (Hoje, Amanhã, etc.)
 */
export function getRelativeDayLabel(date: string | Date, lang: Lang = 'pt'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = getTodayLocal();

  if (isToday(d)) return lang === 'pt' ? 'Hoje' : 'Today';
  if (isTomorrow(d)) return lang === 'pt' ? 'Amanhã' : 'Tomorrow';
  if (isYesterday(d)) return lang === 'pt' ? 'Ontem' : 'Yesterday';

  return formatDate(d, lang);
}

/**
 * Get days remaining until a date
 */
export function getDaysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(getTodayLocal());
  return differenceInDays(startOfDay(d), today);
}

/**
 * Format days remaining as label
 */
export function getDaysUntilLabel(date: string | Date, lang: Lang = 'pt'): string {
  const days = getDaysUntil(date);

  if (days < 0) return lang === 'pt' ? 'Atrasado' : 'Overdue';
  if (days === 0) return lang === 'pt' ? 'Hoje' : 'Today';
  if (days === 1) return lang === 'pt' ? 'Amanhã' : 'Tomorrow';

  return lang === 'pt'
    ? `Faltam ${days} dias`
    : `${days} days left`;
}

/**
 * Get the current date as YYYY-MM-DD string (São Paulo timezone)
 */
export function getTodayISO(): string {
  const today = getTodayLocal();
  return format(today, 'yyyy-MM-dd');
}

/**
 * Get start and end of day in UTC for database queries
 */
export function getDayBounds(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfDay(d),
    end: endOfDay(d),
  };
}

/**
 * Get greeting based on time of day
 */
export function getGreetingKey(): string {
  const hour = getTodayLocal().getHours();
  if (hour < 12) return 'header.greeting_morning';
  if (hour < 18) return 'header.greeting_afternoon';
  return 'header.greeting_evening';
}
