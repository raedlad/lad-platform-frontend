# 🧠 SYSTEM_GUIDE.md

## ⚙️ Instructions for AI Code Generation

> **Purpose:**
> This file defines how AI tools (like ChatGPT, Copilot, or code generation agents) should interact with the system.
> All code generated **must strictly follow** the architecture and conventions below.

### ✅ AI Rules:

1. Always work inside the `features/` directory using the structure:
   ```
   components/ | hooks/ | services/ | store/ | types/ | utils/
   ```
2. Each feature is **self-contained** and should never directly import logic from another feature.
3. Use **TypeScript** everywhere; avoid `any`.
4. Use **React Hook Form** + **Zod** for forms and validation.
5. Use **Zustand** for state management.
6. Use **api imported from lib/api or axios** for API  calls (through the `services/` layer only).
7. Use **Radix UI**, **ShadCN**, and **TailwindCSS** for all UI components.
8. Use **Framer Motion** for animation (when appropriate).
9. Use **next-intl** for translations.
10. Always return clean, readable, production-quality code.

---

## 🏗️ System Overview

The project follows a **Feature-Driven Modular Architecture** to ensure scalability, separation of concerns, and maintainability.

Each feature is an isolated, self-contained module under `features/<feature-name>`.
This structure ensures that every domain (auth, profile, offers, etc.) can evolve independently.

### Folder Structure Template

```
features/
  └── <feature-name>/
      ├── components/
      ├── hooks/
      ├── services/
      ├── store/
      ├── types/
      ├── utils/
      └── index.ts
```

---

## 📂 Folder-by-Folder Explanation

### 1. `components/`

Holds all **UI components** specific to the feature.

**Purpose:**

- Handles only the presentation layer.
- Uses Radix UI + ShadCN components with TailwindCSS styling.
- Can include motion/animation using Framer Motion.

**Rules:**

- No direct API or state logic.
- Import hooks for logic and stores for state.
- Must be strongly typed.

---

### 2. `hooks/`

Contains **custom hooks** acting as the **logic layer** between UI and services/stores.

**Purpose:**

- Manage feature-specific logic (forms, fetching, etc.)
- Handle side effects and validation.
- Connect `react-hook-form` and `zod` schemas.

**Example Use Cases:**

- `useLoginForm.ts`
- `useProjectList.ts`
- `useOfferSubmission.ts`

---

### 3. `services/`

Handles all **API calls** for the feature, using **Axios**.

**Purpose:**

- Defines HTTP requests to the backend.
- Returns typed data.
- Abstracts API logic away from UI components.

**Example:**

```ts
import axios from "axios";
import { Project } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get("/api/projects");
  return data;
};
```

**Rules:**

- No direct UI or state logic.
- Must use async/await.
- Handle errors with try/catch or a centralized interceptor.

---

### 4. `store/`

Uses **Zustand** for global or feature-specific state management.

**Purpose:**

- Holds persistent or shared state within a feature.
- Exposes actions to mutate the state.

**Example:**

```ts
import { create } from "zustand";
import { User } from "../types/user";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

**Rules:**

- Keep store files small and focused.
- One store per feature unless logically related.
- Use clear and descriptive action names.

---

### 5. `types/`

Contains all **TypeScript interfaces** and **types** related to the feature.

**Purpose:**

- Define shape of API requests and responses.
- Define reusable domain entities.

**Example:**

```ts
export interface Offer {
  id: number;
  project_id: number;
  contractor_id: number;
  offer_amount: number;
  execution_duration_formatted: string;
  expected_start_date: string;
}
```

---

### 6. `utils/`

Contains **utility functions**, **validators**, and **Zod schemas**.

**Purpose:**

- Validation (Zod)
- Data formatting (currency, date, etc.)
- Shared helpers within the feature

**Example:**

```ts
import { z } from "zod";

export const offerSchema = z.object({
  offer_amount: z.number().positive(),
  execution_duration_value: z.number().int().positive(),
});
```

---

## ⚙️ Core Technologies

| Category             | Library                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| UI Components        | **Radix UI**, **ShadCN**, **TailwindCSS**                  |
| State Management     | **Zustand**                                                            |
| Forms                | **React Hook Form**                                                    |
| Validation           | **Zod**                                                                |
| Animations           | **Framer Motion**, **GSAP**                                      |
| HTTP Client          | **Axios**                                                              |
| Internationalization | **next-intl**                                                          |
| Authentication       | **@react-oauth/google**                                                |
| Maps                 | **@react-google-maps/api**                                             |
| Notifications        | **React Hot Toast**, **Sonner**                                  |
| Icons                | **Lucide React**                                                       |
| Date Handling        | **date-fns**                                                           |
| Styling Utilities    | **clsx**, **tailwind-merge**, **class-variance-authority** |

---

## 🧱 Coding Principles

1. **TypeScript First:**Use strong typing everywhere. Avoid `any`.
2. **Single Responsibility:**Each file should do exactly one thing — UI, state, API, or validation.
3. **Validation by Zod:**Always validate input forms and responses when needed.
4. **Forms with RHF:**Combine `react-hook-form` + `zodResolver`.
5. **Consistency in Naming:**Follow naming conventions (see below).
6. **Error Handling:**Always handle potential errors gracefully.
7. **Feature Isolation:**Do not import logic or hooks across unrelated features.
8. **Readable Code:**
   Write clear, documented, and maintainable code.

---

## 🧩 Naming Conventions

| Type      | Example                |
| --------- | ---------------------- |
| Component | `OfferCard.tsx`      |
| Hook      | `useOfferForm.ts`    |
| Service   | `offer.service.ts`   |
| Store     | `useOfferStore.ts`   |
| Type      | `offer.ts`           |
| Utility   | `offerValidation.ts` |

---

## 🌐 Feature Example

Example for a feature named `offers`:

```
features/
  └── offers/
      ├── components/
      │   └── OfferCard.tsx
      ├── hooks/
      │   └── useOffers.ts
      ├── services/
      │   └── offer.service.ts
      ├── store/
      │   └── offer.store.ts
      ├── types/
      │   └── offer.ts
      ├── utils/
      │   └── offerValidation.ts
      └── index.ts
```

**Data Flow Example:**

1. `OfferCard` (UI) → uses
2. `useOffers` (hook) → fetches from
3. `offer.service.ts` (API) → updates
4. `offer.store.ts` (state) → validates with
5. `offerValidation.ts` (utils) → types from
6. `offer.ts` (types)

---

## 📘 File Structure Consistency

All features should share a **consistent internal structure**.
If a feature doesn’t need a specific layer (e.g., store), the folder should still exist as an empty placeholder to keep structure consistent.

---

## 🚀 Development Standards

- **Next.js 15.4.6**
- **React 19.1.0**
- **TypeScript** for static typing
- **TailwindCSS** for design system
- **Zustand** for predictable state
- **Zod** + **React Hook Form** for robust validation
- **Radix UI + ShadCN** for accessible and modern UI
- **Axios** for backend integration
- **next-intl** for localization
- **Framer Motion / GSAP** for rich animations

---

## ✅ Summary

This architecture ensures:

- **Feature isolation** for modular development
- **Reusability** of logic and UI components
- **Scalable structure** for large teams
- **Strong type safety**
- **Consistent design and UX**

> Each feature is a **self-contained mini-application** that can evolve independently without breaking other parts of the system.

---

### 🧭 Quick Reminder for AI:

> When adding or modifying code, always respect this structure.
> Keep the logic modular, clean, and typed.
> Prefer composition, not coupling.

---

**Author:** Ashraf Murad
**Architecture:** Feature-Driven Modular System
**Version:** 1.0
**Last Updated:** October 2025
