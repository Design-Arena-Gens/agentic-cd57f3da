# AI Social Poster

Automated AI-powered social media posting using Airtable for content ideas, OpenAI for text + images, and Make.com for posting to Meta (Instagram, Facebook).

## Environment

Copy `.env.example` to `.env.local` when running locally (or configure on Vercel):

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME` (default: `Content`)
- `OPENAI_API_KEY`
- `BRAND_VOICE` (optional)
- `MAKE_WEBHOOK_POST_NOW` (optional)
- `MAKE_WEBHOOK_SCHEDULE` (optional)

### Airtable Table Fields (Content)
- `Idea` (Long text)
- `PlatformInstagramText` (Long text)
- `PlatformFacebookText` (Long text)
- `ImageUrl` (URL)
- `Status` (Single select: draft, generated, approved, posted, failed)
- `ScheduledTime` (Date/time)
- `FrequencyPerDay` (Number)
- `LastPostedAt` (Date/time)

## Scripts
- `npm run dev`
- `npm run build`
- `npm start`

## API Endpoints
- `GET /api/records` — list Airtable records
- `POST /api/generate` — body: `{ recordId }`
- `POST /api/regen` — body: `{ recordId, what: 'text'|'image'|'both' }`
- `POST /api/approve` — body: `{ recordId, scheduledTime?, frequencyPerDay? }`
- `POST /api/post-now` — body: `{ recordId }`

## Deploy
Use Vercel. Example:

```bash
npx vercel@latest deploy --prebuilt --prod --yes --name agentic-cd57f3da
```
