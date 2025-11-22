import { NextResponse } from 'next/server';
import { AirtableClient } from '@/lib/airtable';

export async function GET() {
  try {
    const records = await AirtableClient.list(100);
    return NextResponse.json({ records });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
