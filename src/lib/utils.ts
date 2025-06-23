import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('fr-FR', options || defaultOptions).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, { year: 'numeric', month: 'short' });
}

export function calculateDuration(startDate: string | Date, endDate?: string | Date): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears > 0) {
    const remainingMonths = diffMonths % 12;
    if (remainingMonths > 0) {
      return `${diffYears} an${diffYears > 1 ? 's' : ''} ${remainingMonths} mois`;
    }
    return `${diffYears} an${diffYears > 1 ? 's' : ''}`;
  }

  if (diffMonths > 0) {
    return `${diffMonths} mois`;
  }

  return 'Moins d\'un mois';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9 -]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'absolute';
    textArea.style.left = '-999999px';
    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    } finally {
      textArea.remove();
    }

    return Promise.resolve();
  }
}

export function downloadAsJson(data: any, filename: string): void {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

  const exportFileDefaultName = filename.endsWith('.json') ? filename : `${filename}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffTime = now.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }

  if (diffHours > 0) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }

  if (diffMinutes > 0) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }

  return 'À l\'instant';
}

export const skillCategories = [
  'Frontend',
  'Backend', 
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Tools',
  'Other'
] as const;

export const projectTags = [
  'React',
  'Next.js',
  'Vue.js',
  'Angular',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'Prisma',
  'PostgreSQL',
  'MongoDB',
  'Tailwind CSS',
  'CSS',
  'HTML',
  'Python',
  'Django',
  'Flask',
  'PHP',
  'Laravel',
  'Docker',
  'AWS',
  'Vercel',
  'Netlify'
] as const;

export const socialIcons = {
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  discord: 'https://discord.com',
  email: 'mailto:',
} as const;