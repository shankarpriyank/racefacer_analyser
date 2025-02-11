import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert MM:SS.mmm format to seconds
export function parseTimeToSeconds(timeStr: string): number {
  const [minutePart, secondPart] = timeStr.split(':');
  const minutes = parseInt(minutePart);
  const seconds = parseFloat(secondPart);
  return minutes * 60 + seconds;
}

// Format seconds back to MM:SS.mmm
export function formatSecondsToTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(3);
  return `${minutes.toString().padStart(2, '0')}:${seconds.padStart(6, '0')}`;
}