'use client';

import { FiCheck, FiX } from 'react-icons/fi';
import type { WCAGLevel } from '@/lib/wcagUtils';

interface WCAGBadgeProps {
  level: WCAGLevel;
  label?: string;
}

const LEVEL_CLS: Record<WCAGLevel, string> = {
  AAA:        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  AA:         'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'AA Large': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  FAIL:       'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function WCAGBadge({ level, label }: WCAGBadgeProps) {
  const isFail = level === 'FAIL';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_CLS[level]}`}>
      {isFail ? <FiX size={10} /> : <FiCheck size={10} />}
      {label ? `${label}: ` : ''}{level}
    </span>
  );
}
