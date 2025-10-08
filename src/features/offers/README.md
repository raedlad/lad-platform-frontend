# Offers Feature

This feature handles all offer-related functionality for both contractors and individual users.

## Structure

The offers feature follows a clean architecture pattern with clear separation of concerns:

```
offers/
├── components/          # React components organized by user type and purpose
│   ├── common/         # Shared components across all user types
│   │   ├── FileUpload.tsx
│   │   ├── OfferCard.tsx
│   │   ├── OfferDetails.tsx
│   │   ├── OfferFilters.tsx
│   │   ├── OfferList.tsx
│   │   └── OfferStats.tsx
│   ├── contractor/     # Contractor-specific components
│   │   ├── forms/      # Form components for creating/updating offers
│   │   │   ├── AddPhaseDialog.tsx
│   │   │   ├── CreateCompleteOfferForm.tsx
│   │   │   ├── UpdateCompleteOfferForm.tsx
│   │   │   └── index.ts
│   │   ├── display/    # Display/list components
│   │   │   ├── ContractorOfferCard.tsx
│   │   │   ├── ContractorOffersList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── individual/     # Individual user-specific components
│   │   ├── display/    # Display/list components
│   │   │   ├── IndividualOfferCard.tsx
│   │   │   ├── IndividualOffersList.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts        # Main barrel export
├── hooks/              # Custom hooks (layer between services and components)
│   ├── useAvailableProjects.ts
│   ├── useContractorOffers.ts
│   ├── useCreateOffer.ts
│   ├── useIndividualOffers.ts
│   ├── useOffers.ts
│   └── index.ts
├── services/           # API service layer (handles HTTP requests only)
│   ├── contractorOffersApi.ts
│   ├── individualOffersApi.ts
│   ├── offersApi.ts
│   └── index.ts
├── store/              # Zustand state management
│   ├── contractorOffersStore.ts
│   ├── individualOffersStore.ts
│   ├── offerDocumentsStore.ts
│   ├── offerStore.ts
│   ├── offersStore.ts
│   └── index.ts
├── types/              # TypeScript type definitions
│   ├── contractor.ts   # Contractor-specific types
│   ├── individual.ts   # Individual-specific types
│   ├── offer.ts        # Base offer types
│   └── index.ts
├── utils/              # Utility functions
│   ├── constants.ts    # Constants and enums
│   ├── formatters.ts   # Data formatting utilities
│   ├── validation.ts   # Zod validation schemas
│   ├── validationMessages.ts  # Validation error messages
│   └── index.ts
├── mock/               # Mock data for development/testing
│   ├── data.ts
│   ├── mockService.ts
│   └── index.ts
└── index.ts            # Feature barrel export

```

## Layer Responsibilities

### 1. Components
**Purpose**: UI rendering and user interaction  
**Rules**:
- Only handle presentation logic
- Use hooks for data and business logic
- Organized by user type (contractor/individual) and purpose (forms/display)
- Common components are shared across user types

### 2. Hooks
**Purpose**: Abstraction layer between components and services  
**Rules**:
- Provide clean API for components
- Handle business logic
- Call services for data operations
- Manage local component state
- Should NOT directly manipulate global store (use services)

### 3. Services  
**Purpose**: API communication and data transformation
**Rules**:
- Handle HTTP requests only
- Transform API responses to match frontend types
- Convert camelCase ↔ snake_case
- NO business logic
- NO direct store access

### 4. Store
**Purpose**: Global state management
**Rules**:
- Zustand stores for state persistence
- Manage application state
- Provide actions for state updates
- Called by hooks, not components

### 5. Types
**Purpose**: TypeScript type definitions
**Rules**:
- Strongly typed interfaces
- Organized by domain (contractor, individual, base)
- Shared across all layers

### 6. Utils
**Purpose**: Utility functions and helpers
**Rules**:
- Pure functions
- Validation schemas (Zod)
- Data formatters
- Constants and enums
- NO side effects

## Data Flow

```
Component → Hook → Service → API
    ↓                ↓
  Store ← ────────────┘

1. Component calls hook method
2. Hook calls service method
3. Service makes API request
4. Service transforms response
5. Service updates store
6. Hook returns data to component
7. Component renders updated state
```

## Usage Examples

### Importing Components
```typescript
// Import from feature barrel
import { 
  CreateCompleteOfferForm,
  ContractorOffersList,
  UpdateCompleteOfferForm 
} from "@/features/offers/components";
```

### Using Hooks
```typescript
// Hook usage in component
import { useContractorOffers } from "@/features/offers/hooks";

function MyComponent() {
  const { 
    offers, 
    isLoading, 
    submitCompleteOffer 
  } = useContractorOffers();
  
  // Use data and methods
}
```

### Calling Services
```typescript
// Services are called by hooks, not directly by components
import { contractorOffersApi } from "@/features/offers/services";

// In a hook:
const response = await contractorOffersApi.submitCompleteOffer(projectId, data);
```

## Best Practices

1. **Component Organization**
   - Forms go in `forms/` subdirectory
   - Display/list components go in `display/` subdirectory
   - Shared components go in `common/`

2. **Hooks as Middleware**
   - Hooks bridge components and services
   - Never call services directly from components
   - Never access store directly from components

3. **Service Purity**
   - Services only handle API calls
   - Transform data between API and frontend formats
   - No business logic in services

4. **Type Safety**
   - All data structures have proper TypeScript types
   - Use types from `types/` directory
   - Don't use `any` unless absolutely necessary

5. **Validation**
   - Use Zod schemas from `utils/validation.ts`
   - Validation messages in `utils/validationMessages.ts`
   - Validate data at form level

## File Naming Conventions

- **Components**: PascalCase (e.g., `CreateCompleteOfferForm.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useContractorOffers.ts`)
- **Services**: camelCase with API suffix (e.g., `contractorOffersApi.ts`)
- **Types**: camelCase (e.g., `contractor.ts`)
- **Utils**: camelCase (e.g., `validation.ts`)
- **Stores**: camelCase with Store suffix (e.g., `contractorOffersStore.ts`)

## Related Features

- **Project**: Similar structure and patterns
- **Auth**: For authentication context
- **Dashboard**: Parent feature using offers components
