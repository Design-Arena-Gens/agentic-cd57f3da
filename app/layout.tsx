import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'AI Social Poster',
  description: 'Automated AI-powered social posting with Airtable and Make',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{fontWeight: 700}}>AI Social Poster</div>
          <div style={{color: '#666'}}>Airtable ? OpenAI ? Make</div>
        </header>
        <main style={{padding: '24px', maxWidth: 1080, margin: '0 auto'}}>{children}</main>
      </body>
    </html>
  );
}
