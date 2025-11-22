import { NextResponse } from 'next/server';
import { AirtableClient, Fields } from '@/lib/airtable';
import { generateImageUrl, generatePlatformTexts } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { recordId } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'recordId required' }, { status: 400 });

    const brandVoice = process.env.BRAND_VOICE || 'Modern, vibrant, friendly, concise';
    const rec = await AirtableClient.retrieve(recordId);
    const idea: string = rec.fields[Fields.Idea] || '';
    if (!idea) return NextResponse.json({ error: 'Idea is empty' }, { status: 400 });

    const [texts, imageUrl] = await Promise.all([
      generatePlatformTexts(idea, brandVoice),
      generateImageUrl(idea, brandVoice),
    ]);

    await AirtableClient.update(recordId, {
      [Fields.Instagram]: texts.instagram,
      [Fields.Facebook]: texts.facebook,
      [Fields.ImageUrl]: imageUrl,
      [Fields.Status]: 'generated',
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
