# Zapline

Zapline — The first fully integrated on-chain trading experience. Trade smarter, faster, safer.

<img width="1919" height="891" alt="image" src="https://github.com/user-attachments/assets/a7a6f21c-6055-4996-b6df-56ca62f87010" />

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) — React framework
- React 19 with TypeScript
- Tailwind CSS v4 — styling
- [@google/genai](https://www.npmjs.com/package/@google/genai) — Google Generative AI client
- [lucide-react](https://lucide.dev/) — icons
- [motion](https://motion.dev/) — animations
- [react-hook-form](https://react-hook-form.com/) + resolvers — forms

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm (or your preferred package manager)

### Installation

```bash
npm install
```

### Environment

Copy the example env file and fill in the required values:

```bash
cp .env.example .env.local
```

### Development

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

### Lint

Run ESLint:

```bash
npm run lint
```

## Project structure

```
app/            # Next.js App Router pages and layouts
components/     # React components
hooks/          # Custom React hooks
lib/            # Utility libraries and shared logic
public/         # Static assets
```

## VS Code debugging

A `.vscode/launch.json` is included with configurations for debugging the Next.js app in Chrome/Edge. Press `F5` or use the Run and Debug panel to attach to the dev server at `http://localhost:3000`.

## License

Private — all rights reserved.
