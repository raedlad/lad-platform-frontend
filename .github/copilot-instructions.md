# GitHub Copilot Instructions for lad-platform-frontend

## Project Architecture

- **Framework:** Next.js (TypeScript, App Router)
- **Styling:** Tailwind CSS, shadcn/ui components
- **Forms & Validation:** React Hook Form + Zod
- **Internationalization:** next-intl setup (`src/messages/` for message files, see `en.json`, `ar.json`)
- **State Management:** Custom hooks and stores (see `src/hooks/`, `src/features/*/store/`)
- **API Layer:** Centralized in `src/lib/api.ts` and `src/lib/apiClient.ts`
- **Component Organization:**
  - UI and layout components in `src/components/`
  - Feature modules in `src/features/`
  - Shared utilities in `src/shared/`

## Developer Workflows

- **Start Dev Server:** `npm run dev` (see README)
- **Build:** Use VS Code build task or `msbuild` for legacy .NET integration
- **Lint/Format:** Auto-format on save, lint via code actions (`source.fixAll`)
- **Auto-save:** Files save on focus change
- **Commit Messages:** Use detailed, emoji-rich messages (see `.vscode/settings.json`)

## Patterns & Conventions

- **Type Safety:** Always use TypeScript types and Zod schemas for API/data validation dont ever use type of any 
- **Form Handling:** Use React Hook Form with Zod for all forms; validation schemas live in feature folders
- **Styling:** Use Tailwind utility classes; shadcn/ui for consistent design
- **Internationalization:** Use next-intl's `useTranslations` and message files in `src/messages/` (`en.json`, `ar.json`).
- **Component Structure:** Prefer functional components, colocate styles and tests
- **API Calls:** Centralize fetch logic in `src/lib/apiClient.ts`; avoid direct fetch in components
- **Error Handling:** Use `toast.error` for user-facing errors

## Integration Points

- **External APIs:** All requests go through `apiClient.ts`
- **State/Store:** Use custom hooks for feature-specific state
- **VS Code Tasks:** Build task uses `msbuild` for .NET interop if present

## Examples

- **Form Example:** See `src/features/profile/components/contractor/ContractorOperational.tsx` for React Hook Form + Zod usage
- **Internationalization Example:** See usage of `useTranslations` from next-intl in components, and message files in `src/messages/en.json`, `src/messages/ar.json`.
- **API Example:** See `src/lib/api.ts` and `src/lib/apiClient.ts`

## References

- For code style, see `.cursor/rules/docs.mdc` and referenced files
- For onboarding, see `README.md`

---

If you are unsure about a pattern, check the relevant feature folder or shared utility. Ask for feedback if conventions are unclear or missing.
