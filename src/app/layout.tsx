import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Figtree, Fraunces } from 'next/font/google';
import { Providers } from '@/components/shell/providers';
import { MOTION_SCRIPT } from '@/lib/motion-script';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-bricolage',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'pennig — van letter tot alinea', template: '%s · pennig' },
  description: 'Leer Nederlands schrijven, van letter tot alinea, met Pim het potlood.',
  applicationName: 'pennig',
};

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="nl" className={`${fraunces.variable} ${bricolage.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        {/* Rustige beweging vóór de eerste weergave toepassen, zodat er niets ongewenst beweegt. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
