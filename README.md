# FloSpatial Fire Service MVP Shell V1

This build replaces the spatial-only main flow with the first Fire Service preparation-advisor MVP shell.

## Included

- Landing screen
- Fire Service pathway selection
- Preparation context screen
- 20-question mechanical Starting Point Assessment
  - 8 hydraulics
  - 4 gears
  - 4 pulleys
  - 4 levers
- Local guest journey persistence
- Evidence calculation by mechanical subcompetency
- Advisor rule engine with three branches:
  - hydraulics-specific constraint
  - broad mechanical foundation constraint
  - no clear primary constraint
- First Advisor Insight screen
- Why explanation modal
- Dashboard with recommendation, current focus, readiness snapshot, recent progress, baseline summary and save status

## Notes

- No account or email is required.
- Hydraulic Fundamentals is shown as the next recommendation but remains a coming-soon CTA in this build.
- The previously patched spatial trial should be preserved separately as Spatial Reasoning Module V1.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
