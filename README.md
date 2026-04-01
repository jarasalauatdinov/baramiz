# Baramiz Frontend

Baramiz is a multilingual tourism frontend for Karakalpakstan. It is designed as a destination-first travel platform where users can discover places, browse services and guides, and generate practical route plans inside one product experience.

This repository contains the public web frontend built with React, TypeScript, Vite, Mantine, React Router, and i18next.

## Who it is for

- Travelers planning a visit to Karakalpakstan
- Users who want to explore destinations, attractions, services, and local guides
- Teams presenting or extending the Baramiz product for demos, pilots, or future backend integration

## Main user flows

### 1. Explore destinations

`Home -> Destinations -> Destination details -> Places / Map / Services`

Users start from the homepage, browse major destinations, open a destination page, and continue into nearby places, service options, or map-based exploration.

### 2. Discover places

`Home or Places -> Places listing -> Destination or route planning`

Users can browse tourism places across categories and cities, then continue into destination discovery or route planning.

### 3. Plan a route

`Home or Route Generator -> Route Generator -> Route Result`

Users select planning preferences such as city, interests, trip style, transport, and budget. The frontend then produces a structured route result and connects it to map actions, travel tips, guides, and services.

### 4. Explore local support

`Home -> Services / Guides`

Users can browse tourism services and local guides that complement destinations and planned routes.

## Tech stack

- React 19
- TypeScript
- Vite
- Mantine UI
- React Router
- react-i18next / i18next
- Leaflet + React Leaflet

## Project structure overview

The codebase follows a modular, product-oriented structure. It is not a page-only prototype.

```text
src/
  api/          Thin app-level API exports
  assets/       Static assets
  components/   Shared UI components and layout building blocks
  data/         View adapters around typed mock/domain data
  entities/     Domain models, API access, and mock catalogs
  features/     Feature-specific logic, such as route planning
  locales/      Base translation JSON files
  pages/        Route-level pages
  router/       Route definitions and route helpers
  shared/       Shared config, i18n helpers, API utilities, and common libs
  types/        App-wide API-facing types
  utils/        Focused utility helpers
```

### Important structure notes

- `src/entities/*/model` contains typed domain-oriented mock catalogs and model types.
- `src/data/*` provides page-friendly or localized adapters on top of those domain models.
- `src/entities/*/api` contains backend-facing logic for real data such as places, categories, and routes.
- `src/features/route-planning` contains the route planning form, planner logic, and route result helpers.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ASSET_ORIGIN=http://localhost:3000
```

### 3. Start development server

```bash
npm run dev
```

The frontend will be available through the Vite dev server. The backend should run separately.

## Development commands

```bash
npm run dev      # Start Vite development server
npm run build    # Type-check and build production bundle
npm run preview  # Preview the production build locally
```

## Current backend integration

The frontend is already wired for a separate backend deployment.

Environment handling:

- `VITE_API_BASE_URL` is used for backend API requests
- `VITE_ASSET_ORIGIN` is used to resolve backend-hosted images and media

Current real backend integrations include:

- categories
- places
- featured places
- route generation
- chat endpoint support

The route generator is structured backend-first. When richer planner preferences are not fully supported by the backend yet, the frontend can still shape a believable result using its local planning layer without changing the page-level UX.

## Future backend integration notes

Some product modules are still frontend-owned catalogs by design until dedicated backend endpoints are available:

- destinations
- services
- guides
- route option definitions and fallback planning metadata

This makes future backend integration straightforward:

1. keep the current page and component contracts
2. replace catalog adapters with backend-backed repositories or API modules
3. preserve the same UI flows and typed models where possible

Recommended future backend additions:

- destinations endpoint
- services endpoint
- guides endpoint
- saved routes endpoint
- richer route generation input and result contracts

## Multilingual support

Baramiz supports four UI languages:

- `kaa` - Karakalpak
- `ru` - Russian
- `uz` - Uzbek
- `en` - English

Implementation notes:

- language state is managed through `react-i18next`
- selected language is persisted in `localStorage`
- translation keys are being organized by module and page to make scaling easier
- backend content can still be single-language for now, but the frontend is prepared for multilingual UI from the start

## Product notes

Baramiz should feel like a real tourism platform, not a generic landing page or a route-generation gimmick. The current frontend architecture reflects that direction:

- destination-first discovery
- route planning as a product feature, not the whole product
- strong support for services and guides
- modular structure ready for future API expansion

