export type History = {
  id: string;
  durationMinutes: number; // in minutes
  side: 'left' | 'right';
  startTime: string; // ISO date string
}