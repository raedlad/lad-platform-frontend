# Contract Management Feature

A comprehensive client-centric contract management system that simulates the full negotiation and signing flow between clients and contractors.

## 📋 Features

- **Full Contract Lifecycle**: From draft creation to final signatures
- **Role-Based Actions**: Different permissions for clients and contractors
- **Additional Clauses Management**: Clients can add, edit, and remove custom clauses
- **Negotiation Timeline**: Track all changes and comments throughout the process
- **Status Tracking**: Visual progress bar showing contract stages
- **Mock PDF Generation**: Simulated PDF signing functionality

## 🗂️ Project Structure

```
features/contract/
├── components/
│   ├── ContractViewer.tsx        # Displays contract details
│   ├── AdditionalClausesEditor.tsx # Manages additional clauses
│   ├── ContractActions.tsx       # Role-based action buttons
│   ├── ContractStatusBar.tsx     # Visual status progress
│   ├── NegotiationTimeline.tsx   # Version history timeline
│   └── RoleToggle.tsx            # Testing role switcher
├── store/
│   └── useContractStore.ts       # Zustand state management
├── services/
│   └── contract.service.ts       # Mock API services
├── hooks/
│   └── useContractManagement.ts  # Custom hook for contract logic
├── mock/
│   └── contract.mock.ts          # Mock data
├── types/
│   └── contract.ts               # TypeScript types
├── utils/
│   └── contractValidation.ts     # Zod validation schemas
├── pages/
│   └── ContractPage.tsx          # Main contract page
└── index.ts                       # Feature exports
```

## 🧭 Contract Status Flow

1. **Waiting for Contract Draft** → System creates initial draft
2. **Awaiting Client Review** → Client reviews and can edit additional clauses
3. **Awaiting Contractor Review** → Contractor reviews the contract
4. **Awaiting Client Modification** → Client addresses contractor's change requests
5. **Approved - Awaiting Signatures** → Contract approved, ready for signing
6. **Awaiting Contractor Signature** → Client has signed, waiting for contractor
7. **Signed - Active** → Both parties signed, contract is active

## 👥 User Roles & Permissions

### Client
- ✅ Edit additional clauses (during review phases)
- ✅ Send contract to contractor
- ✅ Sign contract when approved
- ❌ Cannot modify standard clauses
- ❌ Cannot approve contract

### Contractor
- ✅ Request changes with comments
- ✅ Approve contract
- ✅ Sign contract after client
- ❌ Cannot edit any clauses directly
- ❌ Cannot send contract

## 🚀 Usage

### Access the Feature

The contract management feature can be accessed through:

1. **Demo Page** (for testing):
   ```
   http://localhost:3000/contract-demo
   ```

2. **Client Dashboard**:
   ```
   /dashboard/individual/projects/[projectId]/contract
   ```

3. **Contractor Dashboard**:
   ```
   /dashboard/contractor/contracts/[contractId]
   ```

### Testing Different Scenarios

Use the **Role Toggle** component at the top of the page to switch between client and contractor views for testing different workflows:

1. **As Client**:
   - Edit additional clauses
   - Send to contractor for review
   - Sign when approved

2. **As Contractor**:
   - Request changes with comments
   - Approve the contract
   - Sign after client signs

### Reset Contract

Click the "Reset Contract" button to restore the initial state and test different scenarios.

## 🔧 Integration

### Basic Integration

```tsx
import { ContractPage } from "@/features/contract";

export default function YourPage() {
  return <ContractPage />;
}
```

### With Role Control

```tsx
import { ContractPage, useContractStore } from "@/features/contract";
import { useEffect } from "react";

export default function ContractorView() {
  const setRole = useContractStore((state) => state.setRole);
  
  useEffect(() => {
    setRole("contractor");
  }, [setRole]);
  
  return <ContractPage />;
}
```

### Using the Custom Hook

```tsx
import { useContractManagement } from "@/features/contract/hooks/useContractManagement";

export default function YourComponent() {
  const {
    contract,
    currentRole,
    isLoading,
    canEdit,
    canSign,
    sendToContractor,
    signContractAction,
  } = useContractManagement(contractId);
  
  // Use the hook's methods and state
}
```

## 🎨 UI Components

All components use:
- **Shadcn/UI** for base components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Framer Motion** ready for animations

## 📝 Mock Data

The feature uses mock data to simulate the contract flow. In production, replace the mock services with actual API calls:

```typescript
// Current (Mock)
import { mockContract } from "../mock/contract.mock";

// Production (Replace with)
import { api } from "@/lib/api";
const { data } = await api.get(`/contracts/${contractId}`);
```

## 🔄 State Management

The feature uses **Zustand** for state management with the following actions:

- `setRole(role)` - Switch between client/contractor roles
- `updateAdditionalClauses(clauses)` - Update additional clauses
- `addAdditionalClause(text)` - Add new clause
- `removeAdditionalClause(id)` - Remove a clause
- `sendToOtherParty()` - Send contract to other party
- `requestChanges(comment)` - Request changes (contractor only)
- `approveContract()` - Approve contract (contractor only)
- `signContract()` - Sign the contract
- `resetContract()` - Reset to initial state

## ✅ Validation

The feature includes Zod schemas for validation:

- Additional clause text validation (10-500 characters)
- Change request comments (20-1000 characters)
- Status transition validation
- Form data validation

## 🚦 Testing Checklist

- [ ] Client can add/edit/remove additional clauses
- [ ] Client can send contract to contractor
- [ ] Contractor can request changes with comments
- [ ] Contractor can approve contract
- [ ] Client can sign approved contract
- [ ] Contractor can sign after client
- [ ] Status bar updates correctly
- [ ] Timeline shows all versions
- [ ] Role toggle works correctly
- [ ] Reset functionality works

## 🔮 Future Enhancements

- [ ] Real backend integration
- [ ] PDF preview and download
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Contract templates
- [ ] Digital signature integration
- [ ] Audit trail
- [ ] Contract expiry dates
- [ ] Payment milestones integration

## 📚 Dependencies

- React 19.1.0
- Next.js 15.4.6
- Zustand (state management)
- Shadcn/UI components
- Zod (validation)
- date-fns (date formatting)
- sonner (toast notifications)

---

**Author**: Contract Management System
**Version**: 1.0.0
**Last Updated**: October 2024
