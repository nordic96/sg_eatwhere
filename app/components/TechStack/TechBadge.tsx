'use client';

import { cn } from '@/app/utils';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

export interface TechBadgeProps {
  /** Technology name displayed in the badge */
  name: string;
  /** Icon to display (emoji or custom element) */
  icon: string | React.ReactNode;
  /** Optional URL to technology documentation */
  url?: string;
  /** Optional description shown on hover */
  description?: string;
  /** Optional custom color for the badge */
  color?: string;
}

const badgeBaseStyles =
  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-1 min-w-[100px] min-h-[100px] max-sm:min-w-[80px] max-sm:min-h-[80px] max-sm:p-3';

const iconStyles = 'text-3xl max-sm:text-2xl';
const nameStyles = 'text-sm font-medium text-gray-700 max-sm:text-xs text-center';

export default function TechBadge({ name, icon, url, description, color }: TechBadgeProps) {
  const badgeContent = (
    <div
      className={cn(badgeBaseStyles, 'cursor-pointer')}
      style={color ? { borderColor: color } : undefined}
    >
      <span className={iconStyles} style={color ? { color } : undefined}>
        {icon}
      </span>
      <span className={nameStyles}>{name}</span>
    </div>
  );

  const wrappedContent = description ? (
    <Tooltip title={description} arrow placement="top">
      {badgeContent}
    </Tooltip>
  ) : (
    badgeContent
  );

  if (url) {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
        aria-label={`Learn more about ${name}`}
      >
        {wrappedContent}
      </Link>
    );
  }

  return wrappedContent;
}
