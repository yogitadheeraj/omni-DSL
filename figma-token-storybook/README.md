# Figma Token Storybook

Pulls design tokens from a Figma file, exposes them as JSON + CSS variables, and previews them in a React Storybook.

## Structure

```
figma-token-storybook/
├─ server/   Express service that calls the Figma API and normalizes tokens
└─ web/      React app + Storybook that consume those tokens
```

## Run

1. Server
   ```bash
   cd server
   cp .env .env.local   # then fill FIGMA_TOKEN and FIGMA_FILE_KEY
   npm install
   npm run dev
   # http://localhost:4000/tokens  -> JSON
   # http://localhost:4000/tokens.css -> CSS variables
   ```

2. Web app
   ```bash
   cd web
   npm install
   npm run dev         # app at http://localhost:5173
   npm run storybook   # Storybook at http://localhost:6006
   ```

The `TokenProvider` fetches `/tokens` from the server and applies them as
`--token-name` CSS variables on `:root`, so components (and Storybook
stories) can reference them via `var(--color-brand-primary)`.