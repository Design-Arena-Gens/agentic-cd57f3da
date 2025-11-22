import { NextResponse } from 'next/server';
import { AirtableClient, Fields } from '@/lib/airtable';
import { generateImageUrl, generatePlatformTexts } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { recordId, what } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'recordId required' }, { status: 400 });
    const brandVoice = process.env.BRAND_VOICE || 'Modern, vibrant, friendly, concise';
    const rec = await AirtableClient.retrieve(recordId);
    const idea: string = rec.fields[Fields.Idea] || '';

    let updates: Record<string, any> = {};
    if (what === 'text' || what === 'both') {
      const texts = await generatePlatformTexts(idea, brandVoice);
      updates[Fields.Instagram] = texts.instagram;
      updates[Fields.Facebook] = texts.facebook;
    }
    if (what === 'image' || what === 'both') {
      const imageUrl = await generateImageUrl(idea, brandVoice);
      updates[Fields.ImageUrl] = imageUrl;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Specify what: text | image | both' }, { status: 400 });
    }

    updates[Fields.Status] = 'generated';
    await AirtableClient.update(recordId, updates);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
