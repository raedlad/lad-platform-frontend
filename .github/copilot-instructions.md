# LAD Platform - Copilot Instructions

## Architecture Overview

LAD is a Next.js 15 platform using App Router with TypeScript, serving as a construction industry marketplace connecting service providers (contractors, engineers, suppliers) with service seekers (individuals, organizations).

### Core Structure

- **Feature-based architecture**: `src/features/[feature-name]/` contains components, hooks, services, store, types, constants, utils
- **Shared resources**: `src/shared/` for cross-feature components and utilities
- **Route groups**: `(auth)`, `(marketing)`, `dashboard/` with role-based nested routes
- **Role-specific dashboards**: `/dashboard/contractor/`, `/engineering_office/`, etc.

## Technology Stack & Patterns

### State Management

- **Zustand** for client state with feature-specific stores (`authStore`, `registrationStore`)
- Stores include devtools middleware and handle optimistic updates with error states
- Use selectors for derived state: `const { user, isAuthenticated } = useAuthStore()`

### Internationalization (i18n)

- **next-intl** without URL routing, cookie-based locale storage (`NEXT_LOCALE`)
- Support for English/Arabic with RTL layout: `getTextDirection(locale)`
- Namespaced translations: `useTranslations('auth')`
- Client locale detection: `getLocaleFromClient()`, server: `getServerLocale()`

### API & Data Flow

- Axios-based API client with standardized response wrapper in `lib/apiClient.ts`
- Token-based authentication using `tokenStorage` utility
- All API responses follow `ApiResponse<T>` interface with success/data/message pattern

### Component Patterns

- Use `function` keyword for components, not `const`
- Shadcn UI + Radix components for consistent design system
- File structure: exported component → subcomponents → helpers → static content → types
- Export types from feature-specific `types/index.ts` files

### Routing & Auth

- Role-based routing with middleware redirects
- Authentication state managed via `AuthProvider` wrapper
- Protected routes check `tokenStorage.isAuthenticated()`
- Role-specific dashboard layouts in nested route folders

## Development Workflows

### Running the Project

```bash
npm run dev --turbopack  # Development with Turbo
npm run build           # Production build
npm run lint           # ESLint (currently disabled in builds)
```

### Path Aliases

```typescript
"@/*": ["./src/*"]           // General src imports
"@auth/*": ["./src/features/auth/*"]  // Auth feature
"@shared/*": ["./src/shared/*"]       // Shared resources
```

### Form Handling

- react-hook-form with Zod validation schemas
- Schemas stored in `constants/` directories within features
- Shadcn Form components for consistent styling
- Password visibility toggles in auth forms

### Styling Conventions

- Mobile-first Tailwind CSS approach
- Custom utility classes in `globals.css` for repeated patterns
- Semantic color tokens: `text-primary`, `bg-background`, `border-border`
- Consistent spacing: `gap-4`, `p-4`, `m-4` over arbitrary values
- Dark mode support with `dark:` prefixes

## Critical Workflows

### User Registration Flow

- Multi-step registration managed by `authStore` with role-specific data buckets
- Role flow metadata in `auth/constants/roleFlowMeta.ts` defines steps per role
- Dynamic form fields based on selected role (contractor, engineer, supplier, etc.)
- Email/phone verification integrated into registration process

### Dashboard Structure

- Role-based dashboard routes: `/dashboard/[role]/`
- Shared dashboard layout with responsive sidebar navigation
- User avatar dropdown with profile completion progress
- Profile management with tabbed interface (desktop) / accordion (mobile)

### Authentication Patterns

- Token storage with refresh capability in localStorage
- Auth state persistence across page reloads
- Logout clears all stored data and redirects to login
- Role-based access control for dashboard sections

## File Naming & Organization

- Use kebab-case for directories: `features/auth`, `components/common`
- Named exports for components and utilities
- Group related functionality in feature folders
- Separate concerns: components, hooks, services, store, types per feature

Reference the existing Cursor rules in `.cursor/` for additional TypeScript, React, and code quality conventions.
