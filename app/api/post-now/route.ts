import { NextResponse } from 'next/server';
import { AirtableClient, Fields } from '@/lib/airtable';
import { triggerMakePostNow } from '@/lib/make';

export async function POST(req: Request) {
  try {
    const { recordId } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'recordId required' }, { status: 400 });
    const rec = await AirtableClient.retrieve(recordId);

    const payload = {
      recordId,
      idea: rec.fields[Fields.Idea],
      instagram: rec.fields[Fields.Instagram],
      facebook: rec.fields[Fields.Facebook],
      imageUrl: rec.fields[Fields.ImageUrl],
      postAt: new Date().toISOString(),
    };

    await triggerMakePostNow(payload);

    await AirtableClient.update(recordId, {
      [Fields.Status]: 'posted',
      [Fields.LastPostedAt]: payload.postAt,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
