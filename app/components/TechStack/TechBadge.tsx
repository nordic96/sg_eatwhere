'use client';

import { cn } from '@/app/utils';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import type { SimpleIcon } from 'simple-icons';

export type TechBadgeProps = SimpleIcon & { description: string };

const badgeBaseStyles =
  'flex flex-col items-center justify-center gap-2 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-1 min-w-[80px] min-h-[80px] max-sm:min-w-[70px] max-sm:min-h-[70px] max-sm:p-3';

const iconStyles = 'min-w-12 h-12 md:min-w-10 md:h-10 max-sm:min-w-10 max-sm:h-10';
const nameStyles = 'text-sm font-medium text-[#333] max-sm:text-xs text-center';

export default function TechBadge({ title, svg, source, description }: TechBadgeProps) {
  const badgeContent = (
    <div className={cn(badgeBaseStyles, 'cursor-pointer')}>
      <span dangerouslySetInnerHTML={{ __html: svg }} className={iconStyles} />
      <span className={nameStyles}>{title}</span>
    </div>
  );

  const wrappedContent = description ? (
    <Tooltip title={description} arrow placement="top">
      {badgeContent}
    </Tooltip>
  ) : (
    badgeContent
  );

  if (source) {
    return (
      <Link
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline"
        aria-label={`Learn more about ${title}`}
      >
        {wrappedContent}
      </Link>
    );
  }

  return wrappedContent;
}
