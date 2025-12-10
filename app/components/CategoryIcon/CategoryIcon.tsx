import Image, { ImageProps } from 'next/image';
import { EateryCategory } from '@/app/types';

import { cn } from '@/app/utils';
import { catIconContainerStyle, catIconStyle } from '@/app/constants';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

import roosterBowl from '@/public/images/rooter_bowl.svg';
import hawkerBowl from '@/public/images/hawker_bowl.svg';
import chendol from '@/public/images/chendol.svg';
import { ClassValue } from 'clsx';

type CategoryIconProps = {
  cat: EateryCategory;
  iconClass?: string | ClassValue;
} & Omit<ImageProps, 'src' | 'draggable' | 'width' | 'height'>;

const IconMap: Record<EateryCategory, StaticImport> = {
  dessert: chendol,
  restaurant: roosterBowl,
  hawker: hawkerBowl,
};

export default function CategoryIcon({ cat, iconClass, ...imgProps }: CategoryIconProps) {
  const { className, ...otherIconProps } = imgProps;
  return (
    <div className={cn(catIconContainerStyle, className)}>
      <Image
        {...otherIconProps}
        width={'0'}
        height={'0'}
        src={IconMap[cat]}
        alt={imgProps.alt}
        className={cn(catIconStyle(cat), iconClass)}
        draggable={false}
      />
    </div>
  );
}
