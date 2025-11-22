import { NextResponse } from 'next/server';
import { AirtableClient, Fields } from '@/lib/airtable';
import { triggerMakeSchedule } from '@/lib/make';

export async function POST(req: Request) {
  try {
    const { recordId, scheduledTime, frequencyPerDay } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'recordId required' }, { status: 400 });

    const rec = await AirtableClient.retrieve(recordId);
    const payload = {
      recordId,
      idea: rec.fields[Fields.Idea],
      instagram: rec.fields[Fields.Instagram],
      facebook: rec.fields[Fields.Facebook],
      imageUrl: rec.fields[Fields.ImageUrl],
      scheduledTime: scheduledTime || rec.fields[Fields.ScheduledTime] || null,
      frequencyPerDay: frequencyPerDay || rec.fields[Fields.FrequencyPerDay] || 1,
    };

    await AirtableClient.update(recordId, {
      [Fields.Status]: 'approved',
      [Fields.ScheduledTime]: payload.scheduledTime,
      [Fields.FrequencyPerDay]: payload.frequencyPerDay,
    });

    await triggerMakeSchedule(payload);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
