# Workflow Feature Documentation

## Overview

The Workflow feature orchestrates the automatic status transitions between Project Creation, Offers, and Contracts. It implements a state machine that ensures the project moves through the correct lifecycle stages.

## Status Flow

```
draft → receiving_bids → offer_accepted → awaiting_contract_signature → contract_signed → in_progress → completed
```

## Architecture

### 1. Types (`types/workflow.ts`)
- **WorkflowStatus**: Status enum matching project lifecycle
- **WorkflowEvent**: Events that trigger transitions
- **WorkflowTransition**: Defines valid state transitions
- **WorkflowContext**: Context passed through transitions
- **ProjectWorkflowState**: Current workflow state for a project
- **WorkflowTransitionResult**: Result of a transition operation

### 2. Services

#### workflowApi (`services/workflowApi.ts`)
Handles all API calls for workflow operations:
- `getProjectWorkflowState(projectId)` - Get current workflow state
- `transitionProjectStatus(projectId, toStatus, event, metadata)` - Transition status
- `triggerWorkflowEvent(projectId, event, metadata)` - Trigger workflow event
- `validateTransition(projectId, toStatus)` - Validate if transition is allowed
- `getWorkflowHistory(projectId)` - Get workflow transition history

#### workflowOrchestrator (`services/workflowOrchestrator.ts`)
Main orchestration logic for workflow transitions:
- `handleOfferAccepted(projectId, offerId, userId)` - Handles offer acceptance workflow
- `handleContractCreated(projectId, offerId, contractId, userId)` - Handles contract creation
- `handleContractSigned(projectId, contractId, signedBy, userId)` - Handles contract signing
- `handleExecutionStart(projectId, contractId, userId)` - Handles execution start
- `validateTransition(projectId, toStatus)` - Validates transitions

### 3. Adapters

#### offersWorkflowAdapter (`adapters/offersWorkflowAdapter.ts`)
Connects the offers feature with workflow:
- `acceptOfferWithWorkflow(projectId, offerId, userId)` - Accept offer and update workflow
- `canAcceptOffer(projectId, offerId)` - Check if offer can be accepted
- `getOfferAcceptanceValidation(projectId)` - Get validation errors

#### contractWorkflowAdapter (`adapters/contractWorkflowAdapter.ts`)
Connects the contract feature with workflow:
- `createContractWithWorkflow(projectId, offerId, contractId, userId)` - Create contract and update workflow
- `signContractWithWorkflow(projectId, contractId, signedBy, userId)` - Sign contract and update workflow
- `canSignContract(projectId)` - Check if contract can be signed
- `handleFullySignedContract(projectId, contractId, userId)` - Handle both parties signing

### 4. Store (`store/workflowStore.ts`)
Zustand store for workflow state management:
- Manages current workflow state and history
- Provides actions for transitions
- Integrates with orchestrator and adapters

### 5. Hooks

#### useWorkflow (`hooks/useWorkflow.ts`)
Main hook for workflow operations:
```typescript
const {
  currentStatus,
  isTransitioning,
  acceptOffer,
  signContract,
  startExecution,
  canTransition,
  refresh
} = useWorkflow({ projectId, autoFetch: true });
```

#### useProjectWorkflow (`hooks/useProjectWorkflow.ts`)
Project-specific workflow with notifications:
```typescript
const {
  acceptOfferWithWorkflow,
  signContractWithWorkflow,
  startExecutionWithWorkflow
} = useProjectWorkflow({
  projectId,
  onStatusChange: (newStatus) => console.log(newStatus),
  onError: (error) => console.error(error)
});
```

#### useOfferWorkflow (`hooks/useOfferWorkflow.ts`)
Specialized hook for offer acceptance:
```typescript
const {
  acceptOfferWithWorkflow,
  canAcceptOffer,
  isAccepting
} = useOfferWorkflow({
  onSuccess: () => router.push('/dashboard'),
  onError: (error) => console.error(error)
});
```

#### useContractWorkflow (`hooks/useContractWorkflow.ts`)
Specialized hook for contract operations:
```typescript
const {
  signContractWithWorkflow,
  createContractWithWorkflow,
  canSignContract,
  isSigning
} = useContractWorkflow({
  onSuccess: () => router.push('/dashboard'),
  onError: (error) => console.error(error)
});
```

## Usage Examples

### 1. Accepting an Offer with Workflow

```typescript
import { useOfferWorkflow } from '@/features/workflow';
import { useAuthStore } from '@/features/auth';

function OfferAcceptButton({ projectId, offerId }) {
  const user = useAuthStore(state => state.user);
  const { acceptOfferWithWorkflow, isAccepting } = useOfferWorkflow({
    onSuccess: () => {
      // Redirect to contract page
      router.push(`/dashboard/projects/${projectId}/contract`);
    }
  });

  const handleAccept = async () => {
    try {
      await acceptOfferWithWorkflow(projectId, offerId, user.id);
    } catch (error) {
      console.error('Failed to accept offer:', error);
    }
  };

  return (
    <Button 
      onClick={handleAccept} 
      disabled={isAccepting}
    >
      {isAccepting ? 'Accepting...' : 'Accept Offer'}
    </Button>
  );
}
```

### 2. Signing a Contract with Workflow

```typescript
import { useContractWorkflow } from '@/features/workflow';
import { useAuthStore } from '@/features/auth';

function ContractSignButton({ projectId, contractId }) {
  const user = useAuthStore(state => state.user);
  const { signContractWithWorkflow, isSigning } = useContractWorkflow({
    onSuccess: () => {
      // Refresh contract data
      router.refresh();
    }
  });

  const handleSign = async () => {
    try {
      await signContractWithWorkflow(
        projectId, 
        contractId, 
        'client', // or 'contractor'
        user.id
      );
    } catch (error) {
      console.error('Failed to sign contract:', error);
    }
  };

  return (
    <Button 
      onClick={handleSign} 
      disabled={isSigning}
    >
      {isSigning ? 'Signing...' : 'Sign Contract'}
    </Button>
  );
}
```

### 3. Checking Workflow Status

```typescript
import { useWorkflow } from '@/features/workflow';
import { WORKFLOW_STATUS_LABELS } from '@/features/workflow';

function ProjectStatusBadge({ projectId }) {
  const { currentStatus, canTransition } = useWorkflow({
    projectId,
    autoFetch: true
  });

  if (!currentStatus) return null;

  return (
    <div>
      <Badge>{WORKFLOW_STATUS_LABELS[currentStatus]}</Badge>
      {canTransition('in_progress') && (
        <Button>Start Execution</Button>
      )}
    </div>
  );
}
```

## Workflow Transitions

### 1. Project Published
- **From**: `draft`
- **To**: `receiving_bids`
- **Event**: `PROJECT_PUBLISHED`
- **Trigger**: Owner publishes project after completing all steps

### 2. Offer Accepted
- **From**: `receiving_bids`
- **To**: `offer_accepted`
- **Event**: `OFFER_ACCEPTED`
- **Trigger**: Owner accepts a contractor's offer
- **Side Effects**: 
  - Contract creation initiated
  - Other offers rejected automatically

### 3. Contract Created
- **From**: `offer_accepted`
- **To**: `awaiting_contract_signature`
- **Event**: `CONTRACT_CREATED`
- **Trigger**: Backend creates contract from accepted offer
- **Side Effects**: 
  - Notifications sent to both parties
  - Contract draft ready for review

### 4. Contract Signed
- **From**: `awaiting_contract_signature`
- **To**: `contract_signed`
- **Event**: `CONTRACT_FULLY_SIGNED`
- **Trigger**: Both client and contractor sign the contract
- **Intermediate Events**:
  - `CONTRACT_SIGNED_BY_CLIENT`
  - `CONTRACT_SIGNED_BY_CONTRACTOR`

### 5. Execution Started
- **From**: `contract_signed`
- **To**: `in_progress`
- **Event**: `EXECUTION_STARTED`
- **Trigger**: Owner starts project execution
- **Note**: Execution feature will be added later

## Backend API Expectations

The workflow system expects these API endpoints:

### Workflow State
```
GET /projects/{projectId}/workflow/state
Response: {
  projectId, currentStatus, previousStatus,
  acceptedOfferId, contractId, lastTransitionAt,
  canTransitionTo: [], pendingActions: []
}
```

### Workflow Transition
```
POST /projects/{projectId}/workflow/transition
Body: { to_status, event, metadata }
Response: { success, newStatus, previousStatus, event, message }
```

### Workflow Events
```
POST /projects/{projectId}/workflow/events
Body: { event, metadata }
Response: { success, newStatus, message }
```

### Workflow History
```
GET /projects/{projectId}/workflow/history
Response: { history: [...] }
```

### Workflow Validation
```
POST /projects/{projectId}/workflow/validate
Body: { to_status }
Response: { can_transition, reasons: [] }
```

## Integration Points

### With Project Feature
- Project creation sets initial status to `draft`
- Project publishing triggers `PROJECT_PUBLISHED` event

### With Offers Feature
- Offer acceptance calls `offersWorkflowAdapter.acceptOfferWithWorkflow()`
- This updates project status to `offer_accepted`
- Backend should automatically create contract

### With Contract Feature
- Contract creation triggers `CONTRACT_CREATED` event
- Contract signing calls `contractWorkflowAdapter.signContractWithWorkflow()`
- Full signature transitions to `contract_signed`

## Future: Execution Feature

The workflow is prepared for the execution feature:
- Status will transition from `contract_signed` to `in_progress`
- Event `EXECUTION_STARTED` will trigger this
- Additional statuses can be added for execution phases

## Error Handling

All workflow operations include comprehensive error handling:
- Validation before transitions
- Rollback on failure
- User-friendly error messages
- Toast notifications for user feedback

## Best Practices

1. **Always use workflow hooks** instead of directly calling APIs
2. **Check `canTransition`** before showing action buttons
3. **Handle loading states** with `isTransitioning` or `isAccepting`
4. **Provide callbacks** for success/error handling
5. **Refresh workflow state** after external changes
6. **Use adapters** for feature integration, not direct orchestrator calls

## Testing Considerations

When testing workflow:
1. Test each transition independently
2. Verify validation prevents invalid transitions
3. Check side effects (notifications, contract creation)
4. Test error scenarios and rollback
5. Verify state consistency across features

## File Structure

```
src/features/workflow/
├── types/
│   └── workflow.ts
├── services/
│   ├── workflowApi.ts
│   └── workflowOrchestrator.ts
├── adapters/
│   ├── offersWorkflowAdapter.ts
│   └── contractWorkflowAdapter.ts
├── store/
│   └── workflowStore.ts
├── hooks/
│   ├── useWorkflow.ts
│   ├── useProjectWorkflow.ts
│   ├── useOfferWorkflow.ts
│   └── useContractWorkflow.ts
├── utils/
│   └── workflowConstants.ts
├── index.ts
└── README.md
```
