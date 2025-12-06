import { EateryCategory, ThemeColor } from '../types';

export const ThemeRecord: Record<EateryCategory, ThemeColor> = {
  hawker: 'primary',
  dessert: 'green',
  restaurant: 'orange',
};

export const baseLayoutStyle = 'max-w-[1440px] max-sm:max-w-[100vw] px-8 max-sm:px-4 md:px-4';
