# FloSpatial private test build

This is a Vite + React prototype for limited external testing.

## Deployment via Vercel

1. Unzip this folder.
2. Upload the folder contents to a GitHub repository.
3. In Vercel, import the GitHub repository.
4. Use these settings if Vercel does not auto-detect them:
   - Framework: Vite
   - Install command: npm install
   - Build command: npm run build
   - Output directory: dist

## Test access

The temporary shared access password is currently set in `src/App.tsx`:

```ts
const TEST_ACCESS_PASSWORD = "flospatial";
```

This is suitable only for limited private testing. Replace with proper authentication before any public launch.
