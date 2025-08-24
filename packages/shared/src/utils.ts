
import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function calculateDeliveryRate(sent: number, bounced: number): number {
  if (sent === 0) return 0;
  return ((sent - bounced) / sent) * 100;
}

export function calculateOpenRate(delivered: number, opened: number): number {
  if (delivered === 0) return 0;
  return (opened / delivered) * 100;
}

export function calculateClickRate(delivered: number, clicked: number): number {
  if (delivered === 0) return 0;
  return (clicked / delivered) * 100;
}

export function parseQueryParam(param: string | string[] | undefined): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

export function parseNumberParam(param: string | string[] | undefined, defaultValue: number): number {
  const parsed = parseQueryParam(param);
  if (!parsed) return defaultValue;
  const number = parseInt(parsed, 10);
  return isNaN(number) ? defaultValue : number;
}