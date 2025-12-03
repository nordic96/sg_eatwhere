export default function useLangNames(locale?: string) {
  return new Intl.DisplayNames([locale ?? 'en'], { type: 'language' });
}
