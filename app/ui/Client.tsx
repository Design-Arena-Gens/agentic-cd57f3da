"use client";
import { useEffect, useMemo, useState } from 'react';

type RecordItem = {
  id: string;
  fields: Record<string, any>;
};

export default function Client() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frequencyPerDay, setFrequencyPerDay] = useState<number>(1);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/records', { cache: 'no-store' });
      const data = await res.json();
      setRecords(data.records || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onGenerate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/generate', { method: 'POST', body: JSON.stringify({ recordId: id }) });
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (id: string, scheduledTime?: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/approve', { method: 'POST', body: JSON.stringify({ recordId: id, scheduledTime, frequencyPerDay }) });
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to approve');
    } finally {
      setLoading(false);
    }
  };

  const onRegen = async (id: string, what: 'text' | 'image' | 'both') => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/regen', { method: 'POST', body: JSON.stringify({ recordId: id, what }) });
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to regenerate');
    } finally {
      setLoading(false);
    }
  };

  const onPostNow = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await fetch('/api/post-now', { method: 'POST', body: JSON.stringify({ recordId: id }) });
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to trigger post');
    } finally {
      setLoading(false);
    }
  };

  const sorted = useMemo(() => {
    return [...records].sort((a,b) => (a.fields.Status || '').localeCompare(b.fields.Status || ''));
  }, [records]);

  return (
    <div className="container">
      <div className="card">
        <div className="row">
          <div className="badge">Frequency / day</div>
          <input
            type="number"
            min={1}
            value={frequencyPerDay}
            onChange={(e) => setFrequencyPerDay(parseInt(e.target.value || '1', 10))}
            style={{width: 100}}
          />
          <button onClick={refresh} disabled={loading} style={{padding: '8px 12px'}}>Refresh</button>
        </div>
        {error && <div style={{color: 'crimson'}}>{error}</div>}
      </div>

      {loading && <div>Working...</div>}

      {sorted.map(rec => (
        <div className="card" key={rec.id}>
          <div className="row">
            <div className="badge">{rec.fields.Status || 'draft'}</div>
            <div style={{fontWeight: 700}}>{rec.fields.Idea || '(No Idea)'}</div>
          </div>
          <div className="row">
            <div style={{flex: 1}}>
              <label>Instagram</label>
              <textarea rows={4} defaultValue={rec.fields.PlatformInstagramText || ''} readOnly />
            </div>
            <div style={{flex: 1}}>
              <label>Facebook</label>
              <textarea rows={4} defaultValue={rec.fields.PlatformFacebookText || ''} readOnly />
            </div>
          </div>
          <div className="row">
            <div style={{flex: 1}}>
              <label>Image</label>
              {rec.fields.ImageUrl ? (
                <img src={rec.fields.ImageUrl} alt="generated" style={{width: 240, height: 240, objectFit: 'cover', borderRadius: 12, border: '1px solid #eee'}} />
              ) : (
                <div style={{width: 240, height: 240, border: '1px dashed #ccc', borderRadius: 12, display:'grid', placeItems:'center', color:'#888'}}>
                  No image
                </div>
              )}
            </div>
            <div style={{flex: 1}}>
              <label>Schedule</label>
              <input type="datetime-local" id={`schedule-${rec.id}`} />
              <div className="actions" style={{marginTop: 12}}>
                <button onClick={() => onGenerate(rec.id)} disabled={loading} style={{padding:'8px 12px'}}>Generate</button>
                <button onClick={() => onRegen(rec.id, 'text')} disabled={loading} style={{padding:'8px 12px'}}>Regen Text</button>
                <button onClick={() => onRegen(rec.id, 'image')} disabled={loading} style={{padding:'8px 12px'}}>Regen Image</button>
                <button onClick={() => onRegen(rec.id, 'both')} disabled={loading} style={{padding:'8px 12px'}}>Regen Both</button>
              </div>
              <div className="actions">
                <button onClick={() => onApprove(rec.id, (document.getElementById(`schedule-${rec.id}`) as HTMLInputElement)?.value)} disabled={loading} style={{padding:'8px 12px', background:'#111', color:'#fff'}}>Approve</button>
                <button onClick={() => onPostNow(rec.id)} disabled={loading} style={{padding:'8px 12px', background:'#0b5', color:'#fff'}}>Post Now</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
