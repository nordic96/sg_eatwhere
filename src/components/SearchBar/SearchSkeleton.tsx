import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular';
  width?: number | string;
  height?: number | string;
}

function Skeleton({ className = '', variant = 'rectangular', width, height }: SkeletonProps) {
  const baseStyle = 'animate-pulse bg-gray-200';
  const variantStyle = variant === 'circular' ? 'rounded-full' : 'rounded';

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width || '100%',
    height: typeof height === 'number' ? `${height}px` : height || '16px',
  };

  return <div className={`${baseStyle} ${variantStyle} ${className}`} style={style} />;
}

function SearchSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={'flex flex-col gap-2'}>
      {Array.from({ length: rows }).map((_, i) => {
        return (
          <div key={`search-skeleton-${i}`} className={'flex items-center justify-start gap-4'}>
            <Skeleton variant="circular" width={24} height={24} />
            <div className={'flex grow flex-col gap-1'}>
              <Skeleton width={'100%'} height={24} />
              <div className={'flex gap-2 w-[50%]'}>
                <Skeleton width={'100%'} height={14} />
                <Skeleton width={'100%'} height={14} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(SearchSkeleton);
