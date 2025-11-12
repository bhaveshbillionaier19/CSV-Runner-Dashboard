# CSV Dashboard

## 1. Project Overview
- **Challenge context:** Built for the “Running Data Dashboard” multi-milestone exercise (Milestones 1–4).  
- **What it does:** Lets an analyst upload a running log CSV, validates required columns/values, computes overall and per-runner metrics, and visualises mileage trends with interactive charts.

## 2. Assumptions
- Input CSVs are small enough for client-side parsing (no backend upload/persistence).
- Required headers are exactly `date`, `person`, `miles run` (case-insensitive); others are ignored.
- Dates arrive in `DD/MM/YYYY` and must be valid calendar dates. Internally we normalize to ISO for calculations/charts.
- Mileage is a positive number (zero/negative treated as invalid).
- No authentication/authorization; everyone with the URL can upload data.
- No drag-and-drop, multi-file handling, or persistence (session-only workflow).

## 3. Prerequisites
- **Node.js:** v18 or later (tested on 18.20).  
- **npm:** v9+ (bundled with Node 18).  
- **Browser:** Modern Chromium, Firefox, or Safari.  
- **Other tooling:** None (no databases or external services).

## 4. Setup
1. **Clone**
   ```bash
   git clone <repository-url>
   cd "dyant project"
   ```
2. **Install**
   ```bash
   npm install
   ```
3. **Environment variables**
   - None required. If new vars are introduced, create `.env.example` documenting each key before copying to `.env`.
4. **Seed data**
   - Not applicable; supply CSV files manually (see sample below).

## 5. Run & Verify
1. **Development server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000.
2. **Production build (optional)**
   ```bash
   npm run build
   npm start
   ```
3. **Acceptance checklist**
   - Upload CSV → immediate parsing & header validation.
   - Remove a required header → expects descriptive error alert.
   - Provide bad date (`32/01/2024`) → row-level error referencing DD/MM/YYYY.
   - Provide invalid miles (`-3`, `abc`, `0`) → row-level error for each.
   - With valid data → overall metrics, per-person cards, and success banner appear.
   - Use “Filter by Runner” select → metrics + chart update to that runner.
   - Confirm chart shows dates as dd/mm/yyyy (tooltips & axis).
   - Click “Clear Data” → dashboard resets to initial state.
4. **Test credentials**
   - None required; fully client-side.
5. **Sample CSV**
   ```csv
   date,person,miles run
   01/01/2024,Alice,5.2
   02/01/2024,Bob,3.5
   03/01/2024,Alice,4.8
   04/01/2024,Charlie,6.1
   05/01/2024,Bob,4.2
   06/01/2024,Alice,5.5
   07/01/2024,Charlie,5.9
   08/01/2024,Bob,3.8
   09/01/2024,Alice,6.2
   10/01/2024,Charlie,4.5
   ```

## 6. Features & Limitations
### Implemented
- Client-side CSV parsing/validation with PapaParse.
- Header, date (DD/MM/YYYY), and miles validation with detailed error reporting.
- Loading spinner + success/error alerts.
- Overall statistics, per-person metrics, runner filter.
- Responsive Recharts line chart (overall vs. per-person view).
- Clear Data button and smooth scroll-to-results animation.

### Known gaps / future work
- No drag-and-drop, multi-file upload, or data persistence.
- No automated tests (unit/e2e).
- Only a line chart; bar charts or comparisons could add value.
- Accessibility could add aria-live status and keyboard shortcuts for results section.
- Large CSVs may strain client memory; future iteration could stream/validate server-side.

## 7. Architecture Notes
- **Framework:** Next.js 14 App Router (all components are client-side).
- **State:** `app/page.tsx` owns parsed data using React state/hooks; metrics are derived via `useMemo`.
- **Key components & flow:**
  - `components/FileUpload.tsx` – handles file input, parsing, validation feedback.
  - `lib/csvParser.ts` – wraps PapaParse, normalizes dates, returns errors & valid rows.
  - `lib/metrics.ts` – derives overall/per-person metrics and chart datasets.
  - `components/MetricsDisplay.tsx`, `PersonSelector.tsx`, `MilesChart.tsx` – present data.
  - `components/ui/*` – shadcn/ui primitives (Alert, Button, Card, Select, Spinner, etc.).
- **Folder layout**
  ```
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    FileUpload.tsx
    MetricsDisplay.tsx
    MilesChart.tsx
    PersonSelector.tsx
    ui/...
  lib/
    csvParser.ts
    metrics.ts
    utils.ts
  ```

## 8. Accessibility & UI
- **Labels & focus:** Upload button controls hidden file input; select and alerts come from Radix-based shadcn/ui components with accessible labels.
- **Error messaging:** Validation alerts use semantic `role="alert"` for screen reader announcement.
- **Color & typography:** Tailwind theme ensures high contrast; consistent Inter font hierarchy and spacing.
- **Motion & layout:** Smooth scroll and fade-in animations on data load, kept brief to reduce motion discomfort; layout adapts to mobile/tablet/desktop with responsive utility classes.

---



