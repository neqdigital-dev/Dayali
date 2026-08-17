export const APP_NAME = 'Dayali';

export const CATEGORIES = ['personal', 'work', 'college'] as const;
export type Category = (typeof CATEGORIES)[number];

export const TASK_TYPES = ['daily', 'weekly', 'monthly', 'custom', 'one_time'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export const TASK_STATUSES = ['pending', 'completed', 'postponed', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ['low', 'normal', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CHURCH_EVENT_TYPES = ['preaching', 'participation', 'informative'] as const;
export type ChurchEventType = (typeof CHURCH_EVENT_TYPES)[number];

export const EXAM_STATUSES = ['upcoming', 'studying', 'completed', 'graded'] as const;
export type ExamStatus = (typeof EXAM_STATUSES)[number];

export const ASSIGNMENT_STATUSES = ['pending', 'in_progress', 'completed', 'submitted', 'graded'] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const STUDY_SESSION_STATUSES = ['pending', 'completed', 'skipped'] as const;
export type StudySessionStatus = (typeof STUDY_SESSION_STATUSES)[number];

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

// Default water settings
export const DEFAULT_WATER_GOAL = 8;
export const DEFAULT_WATER_CUP_ML = 250;

// Category colors (for JS logic — CSS vars handle the visual)
export const CATEGORY_COLORS: Record<Category, string> = {
  personal: 'var(--color-personal)',
  work: 'var(--color-work)',
  college: 'var(--color-college)',
};

export const CHURCH_EVENT_TYPE_ICONS: Record<ChurchEventType, string> = {
  preaching: 'Mic',
  participation: 'MapPin',
  informative: 'Info',
};
