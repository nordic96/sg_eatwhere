import { ClassValue } from 'clsx';
import { EateryCategory, ThemeColor } from '../types';

export const ThemeRecord: Record<EateryCategory, ThemeColor> = {
  hawker: 'primary',
  dessert: 'green',
  restaurant: 'orange',
};

export const baseLayoutStyle =
  'max-w-[1440px] max-sm:max-w-[100vw] xl:px-8 lg:px-4 max-sm:px-4 md:px-4';

export const h1BaseStyle =
  'lg:text-5xl md:text-4xl max-sm:text-4xl whitespace-pre-line font-black leading-none';
export const microTextBaseStyle = 'font-light text-xl whitespace-pre-line max-sm:text-lg';

export const catIconContainerStyle =
  'w-10 rounded-full bg-white p-1 border-solid border-[#333] border flex justify-center';
export const catIconStyle = (cat: EateryCategory): ClassValue => ({
  'w-9': true,
  'h-5': cat === 'dessert',
});

export const primaryButtonStyle =
  'bg-primary text-white hover:bg-red-700 active:bg-red-700 cursor-pointer py-2 px-4 flex gap-1 max-sm:px-2 rounded-3xl text-md items-center';
