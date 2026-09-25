# Smart Paper Creator

Design a mobile-friendly responsive app for Indian school teachers to help them preparing and set up subject-wise ready-made question-papers, assignments, MCQs as per CBSE English medium, from LKG to std. 10 as per NCERT curriculum. Categorize them in three formats: Easy, Medium and Hard on difficulty basis. Also prepare and divide those question papers in 4 types of exams, embedded with marks scheduled around a year (For example, 1st internal, 2nd Internal, 3rd Internal and Annual exams). Keep this format very smooth scrollable and easy to read for students, without any clutters. Try to cover entire syllabus with shareable or printable PDF format options. Apply proper navigation system, so users can operate, move, back or jump to the pages very easily.

# Question Paper Studio

A responsive teacher workspace for creating, reviewing, sharing and printing CBSE/NCERT-aligned question papers.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Android

Install Android Studio and the Android SDK, then run `npm run cap:android`. The web build is copied into the generated Capacitor Android project by `npm run cap:sync`.

## AI Gateway

Deploy `smart-paper-backend` as its own Render Web Service with build command `npm install` and start command `npm start`. Add `GROQ_API_KEY` and optionally `GROQ_MODEL` (for example, `openai/gpt-oss-20b`) to the Render environment variables. The service exposes `GET /health` and `POST /api/generate-paper`.

Set the frontend `VITE_AI_GATEWAY_URL` to the Render service base URL, for example `https://smart-paper-backend.onrender.com`, or to the full `/api/generate-paper` URL. The frontend accepts either form and sends the paper request in the format expected by this backend. Do not put `GROQ_API_KEY` in any `VITE_*` variable.

## Verified textbook data

Set `VITE_TEXTBOOK_DATA_URL` to a school-controlled endpoint that returns one validated catalog for each `board`, `classLevel`, and `subject` query. The response shape is:

```json
{
	"board": "CBSE",
	"updatedAt": "2026-09-23T00:00:00.000Z",
	"chapters": [
		{
			"id": "class-6-science-food",
			"name": "Components of Food",
			"subject": "Science",
			"textbook": "NCERT Science",
			"edition": "2026",
			"sections": ["Nutrients", "Balanced diet"],
			"concepts": ["carbohydrates", "proteins"],
			"learningOutcomes": ["Identify nutrients in common foods"],
			"sourceUrl": "https://example.school/textbooks/class-6-science"
		}
	]
}
```

Use licensed or official textbook metadata/content only. The app caches validated catalogs locally and falls back to its bundled chapter list when this endpoint is not configured. Keep provider credentials and full textbook retrieval on the server; do not expose them in the Vite client.
