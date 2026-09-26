/** Shared enums/labels + tone/icon mappings for the Job Match analysis. */

export type MatchTone =
  | 'accent'
  | 'success'
  | 'warn'
  | 'info'
  | 'danger'
  | 'default';

export interface MatchMeta {
  label: string;
  tone: MatchTone;
  icon: string;
}

/** Maps a tone to the ResumeIQ tag CSS class ('' = plain .tag). */
export function tagClassFor(tone: MatchTone): string {
  switch (tone) {
    case 'accent':
      return 'tag-accent';
    case 'success':
      return 'tag-success';
    case 'warn':
      return 'tag-warn';
    case 'info':
      return 'tag-info';
    case 'danger':
      return 'tag-danger';
    default:
      return '';
  }
}

export function matchStatusInfo(status: string): MatchMeta {
  switch ((status || '').toUpperCase()) {
    case 'FULL_MATCH':
      return { label: 'Full Match', tone: 'success', icon: 'check' };
    case 'PARTIAL_MATCH':
      return { label: 'Partial Match', tone: 'warn', icon: 'alert-triangle' };
    case 'NO_MATCH':
      return { label: 'No Match', tone: 'danger', icon: 'x' };
    case 'UNKNOWN':
      return { label: 'Unknown', tone: 'info', icon: 'help' };
    default:
      return { label: status || 'Unknown', tone: 'info', icon: 'help' };
  }
}

export function matchTypeInfo(type: string): MatchMeta {
  switch ((type || '').toUpperCase()) {
    case 'EXACT':
      return { label: 'Exact', tone: 'success', icon: 'check' };
    case 'SEMANTIC':
      return { label: 'Semantic', tone: 'accent', icon: 'sparkles' };
    case 'PARTIAL':
      return { label: 'Partial', tone: 'warn', icon: 'alert-triangle' };
    case 'NONE':
      return { label: 'None', tone: 'danger', icon: 'x' };
    default:
      return { label: type || 'Unknown', tone: 'info', icon: 'help' };
  }
}

export function importanceInfo(importance: string): MatchMeta {
  switch ((importance || '').toUpperCase()) {
    case 'HIGH':
      return { label: 'High', tone: 'accent', icon: 'zap' };
    case 'MEDIUM':
      return { label: 'Medium', tone: 'info', icon: 'info' };
    case 'LOW':
      return { label: 'Low', tone: 'default', icon: 'arrow-right' };
    default:
      return { label: importance || 'Unknown', tone: 'info', icon: 'help' };
  }
}

export function priorityInfo(priority: string): MatchMeta {
  switch ((priority || '').toUpperCase()) {
    case 'REQUIRED':
      return { label: 'Required', tone: 'accent', icon: 'alert-circle' };
    case 'PREFERRED':
      return { label: 'Preferred', tone: 'info', icon: 'star' };
    default:
      return { label: priority || 'Unknown', tone: 'info', icon: 'help' };
  }
}

export function categoryInfo(category: string): MatchMeta {
  const c = (category || '').toUpperCase();
  switch (c) {
    case 'SKILL':
      return { label: 'Skill', tone: 'accent', icon: 'code' };
    case 'EXPERIENCE':
      return { label: 'Experience', tone: 'accent', icon: 'briefcase' };
    case 'EDUCATION':
      return { label: 'Education', tone: 'accent', icon: 'graduation-cap' };
    case 'TOOL':
      return { label: 'Tool', tone: 'accent', icon: 'cpu' };
    case 'PROJECT':
      return { label: 'Project', tone: 'accent', icon: 'folder' };
    case 'CERTIFICATION':
      return { label: 'Certification', tone: 'accent', icon: 'shield' };
    default:
      return { label: category || 'Other', tone: 'info', icon: 'layers' };
  }
}

export function relevanceInfo(relevance: string): MatchMeta {
  switch ((relevance || '').toUpperCase()) {
    case 'HIGH':
      return { label: 'High', tone: 'success', icon: 'check' };
    case 'MEDIUM':
      return { label: 'Medium', tone: 'warn', icon: 'alert-triangle' };
    case 'LOW':
      return { label: 'Low', tone: 'info', icon: 'arrow-right' };
    default:
      return { label: relevance || 'Unknown', tone: 'info', icon: 'help' };
  }
}

export function matchStrengthInfo(strength: string): MatchMeta {
  switch ((strength || '').toUpperCase()) {
    case 'HIGH':
      return { label: 'Strong', tone: 'success', icon: 'check' };
    case 'MEDIUM':
      return { label: 'Moderate', tone: 'warn', icon: 'alert-triangle' };
    case 'LOW':
      return { label: 'Weak', tone: 'danger', icon: 'alert-triangle' };
    default:
      return { label: strength || 'Unknown', tone: 'info', icon: 'help' };
  }
}

/** Fallback label when the backend does not provide matchLabel. */
export function matchLabelFallback(score: number): string {
  if (score >= 80) {
    return 'Strong Alignment';
  }
  if (score >= 65) {
    return 'Moderate Alignment';
  }
  if (score >= 50) {
    return 'Partial Alignment';
  }
  return 'Weak Alignment';
}

/** Hero sentence generated from the actual match label, e.g. "Moderate Alignment". */
export function matchSentence(label: string): string {
  const clean = (label || 'alignment').toLowerCase().trim();
  return `Your resume shows ${clean} with the requirements of this role.`;
}

/** confidence 0-1 -> 0-100 percent. */
export function toPercent(value: number | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** score / maxScore * 100 (visualization only). */
export function scorePercent(score: number, maxScore: number): number {
  if (!maxScore) {
    return 0;
  }
  return Math.min(100, Math.round((score / maxScore) * 100));
}