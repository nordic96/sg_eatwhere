export const ENABLE_SIDEBAR = Boolean(process.env.ENABLE_DETAILS_SIDEBAR);

/** Locale Related / Use backup test locale json data (default: false) */
export const USE_TEST_LOCALE = Boolean(process.env.USE_TEST_LOCALE);
export const LOCALES = process.env.NEXT_PUBLIC_LOCALES?.split(',') || ['en'];

/** Which Language to Display translated MRT names with brackets */
export const MRT_LABEL_DISPLAY_LANG = process.env.NEXT_PUBLIC_MRT_DISPLAY_LANG?.split(',') || [];
