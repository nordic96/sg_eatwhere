'use client';

import React, { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Props = {
  messages: Record<string, string>;
  children?: ReactNode;
  locale?: string;
};

export default function CanvasIntlProvider({ messages, children, locale = 'en' }: Props) {
  // This component is mounted in the client root created by the Canvas.
  // We simply expose the same provider inside that root.
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
