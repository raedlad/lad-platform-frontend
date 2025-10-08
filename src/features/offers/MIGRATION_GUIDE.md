# Offers Feature Refactoring - Migration Guide

## Overview

The offers feature has been refactored to follow a clean, consistent architecture pattern matching the project feature structure. This guide helps you update any imports or references to the refactored code.

## Structure Changes

### Before (Old Structure)
```
offers/
├── components/
│   ├── common/
│   ├── contractor/
│   │   ├── AddPhaseDialog.tsx
│   │   ├── ContractorOfferCard.tsx
│   │   ├── ContractorOffersList.tsx
│   │   ├── CreateCompleteOfferForm.tsx
│   │   └── UpdateCompleteOfferForm.tsx
│   └── individual/
│       ├── IndividualOfferCard.tsx
│       └── IndividualOffersList.tsx
```

### After (New Structure)
```
offers/
├── components/
│   ├── common/
│   ├── contractor/
│   │   ├── forms/              # NEW
│   │   │   ├── AddPhaseDialog.tsx
│   │   │   ├── CreateCompleteOfferForm.tsx
│   │   │   └── UpdateCompleteOfferForm.tsx
│   │   └── display/            # NEW
│   │       ├── ContractorOfferCard.tsx
│   │       └── ContractorOffersList.tsx
│   └── individual/
│       └── display/            # NEW
│           ├── IndividualOfferCard.tsx
│           └── IndividualOffersList.tsx
```

## Import Path Changes

### Contractor Components

#### Forms
**Before:**
```typescript
import { CreateCompleteOfferForm } from "@/features/offers/components/contractor/CreateCompleteOfferForm";
import { UpdateCompleteOfferForm } from "@/features/offers/components/contractor/UpdateCompleteOfferForm";
import AddPhaseDialog from "@/features/offers/components/contractor/AddPhaseDialog";
```

**After (Recommended - Use Barrel Export):**
```typescript
import { 
  CreateCompleteOfferForm,
  UpdateCompleteOfferForm,
  AddPhaseDialog 
} from "@/features/offers/components";
```

**After (Direct Import):**
```typescript
import { CreateCompleteOfferForm } from "@/features/offers/components/contractor/forms/CreateCompleteOfferForm";
import { UpdateCompleteOfferForm } from "@/features/offers/components/contractor/forms/UpdateCompleteOfferForm";
import AddPhaseDialog from "@/features/offers/components/contractor/forms/AddPhaseDialog";
```

#### Display Components
**Before:**
```typescript
import { ContractorOffersList } from "@/features/offers/components/contractor/ContractorOffersList";
import { ContractorOfferCard } from "@/features/offers/components/contractor/ContractorOfferCard";
```

**After (Recommended - Use Barrel Export):**
```typescript
import { 
  ContractorOffersList,
  ContractorOfferCard 
} from "@/features/offers/components";
```

**After (Direct Import):**
```typescript
import { ContractorOffersList } from "@/features/offers/components/contractor/display/ContractorOffersList";
import { ContractorOfferCard } from "@/features/offers/components/contractor/display/ContractorOfferCard";
```

### Individual Components

**Before:**
```typescript
import { IndividualOffersList } from "@/features/offers/components/individual/IndividualOffersList";
import { IndividualOfferCard } from "@/features/offers/components/individual/IndividualOfferCard";
```

**After (Recommended - Use Barrel Export):**
```typescript
import { 
  IndividualOffersList,
  IndividualOfferCard 
} from "@/features/offers/components";
```

**After (Direct Import):**
```typescript
import { IndividualOffersList } from "@/features/offers/components/individual/display/IndividualOffersList";
import { IndividualOfferCard } from "@/features/offers/components/individual/display/IndividualOfferCard";
```

### Common Components

**Before & After (No Changes):**
```typescript
import { OfferList } from "@/features/offers/components/common/OfferList";
import { OfferCard } from "@/features/offers/components/common/OfferCard";
import { OfferDetails } from "@/features/offers/components/common/OfferDetails";
import { FileUpload } from "@/features/offers/components/common/FileUpload";
```

**Recommended (Use Barrel Export):**
```typescript
import { 
  OfferList,
  OfferCard,
  OfferDetails,
  FileUpload 
} from "@/features/offers/components";
```

## No Changes Needed For

The following remain unchanged:
- ✅ **Hooks** - Already properly organized in `hooks/`
- ✅ **Services** - Already properly organized in `services/`
- ✅ **Store** - Already properly organized in `store/`
- ✅ **Types** - Already properly organized in `types/`
- ✅ **Utils** - Already properly organized in `utils/`

## Breaking Changes

❌ **Direct imports to contractor components** without specifying `forms/` or `display/` subdirectories will break.

### Example of Breaking Change:
```typescript
// ❌ This will NOT work anymore
import { CreateCompleteOfferForm } from "@/features/offers/components/contractor/CreateCompleteOfferForm";

// ✅ Use this instead
import { CreateCompleteOfferForm } from "@/features/offers/components";
```

## Quick Fix Script

If you have many files to update, use this search and replace pattern:

### Pattern 1: Contractor Forms
**Search:** `@/features/offers/components/contractor/(CreateCompleteOfferForm|UpdateCompleteOfferForm|AddPhaseDialog)`  
**Replace:** `@/features/offers/components`

### Pattern 2: Contractor Display
**Search:** `@/features/offers/components/contractor/(ContractorOffersList|ContractorOfferCard)`  
**Replace:** `@/features/offers/components`

### Pattern 3: Individual Display
**Search:** `@/features/offers/components/individual/(IndividualOffersList|IndividualOfferCard)`  
**Replace:** `@/features/offers/components`

## Benefits of New Structure

1. **Clearer Organization** - Components are grouped by type (forms vs display)
2. **Easier Navigation** - Find what you need faster
3. **Better Scalability** - Easy to add new component types
4. **Consistent Patterns** - Matches project feature structure
5. **Barrel Exports** - Simpler imports using `@/features/offers/components`

## Files Already Updated

The following files have already been updated with the new import paths:
- ✅ `src/app/dashboard/contractor/offers/page.tsx`
- ✅ `src/app/dashboard/contractor/offers/[id]/edit/page.tsx`
- ✅ `src/app/dashboard/contractor/offers/create/[projectId]/page.tsx`
- ✅ All moved components' internal imports

## Need Help?

Refer to:
- `README.md` - Complete structure documentation
- Project feature (`src/features/project/`) - Reference implementation
- Component barrel exports - See `components/index.ts`
