# Workflow Feature - Multi-Stage Project Lifecycle Tracker

## Overview

The **Workflow** feature is a connector module that tracks the current stage of a project throughout its lifecycle. It acts as a bridge between the `project`, `offers`, and `contract` features, determining the current stage based on existing data without making any API calls.

## Architecture

This is a **pure connector feature** with no backend API integration:
- **No API calls** - All logic is client-side
- **Feature-based architecture** - Derives state from existing features
- **Pure functions** - Stage determination based on project/offer/contract data

## Workflow Stages

The system tracks 8 distinct stages in a project lifecycle:

1. **Project Creation** (`project_creation`)
   - Project is being created and configured
   - Status: `draft`, `review_pending`

2. **Awaiting Offers** (`awaiting_offers`)
   - Project published, waiting for contractor offers
   - Status: `published`, `receiving_bids`

3. **Reviewing Offers** (`offer_review`)
   - Owner is reviewing and evaluating contractor offers
   - Has offers but none accepted yet

4. **Contract Negotiation** (`contract_negotiation`)
   - Offer accepted, contract terms being negotiated
   - Status: `offer_accepted`, `awaiting_contract_signature`

5. **Contract Signing** (`contract_signing`)
   - Contract finalized, awaiting signatures
   - Contract status: `Approved - Awaiting Signatures`, `Awaiting Contractor Signature`

6. **Project Execution** (`project_execution`)
   - Contract signed, project work in progress
   - Status: `contract_signed`, `in_progress`

7. **Project Completion** (`project_completion`)
   - Project work completed, final review
   - Status: `completed`

8. **Project Closed** (`project_closed`)
   - Project fully completed and closed
   - Status: `closed_completed`, `cancelled`

## File Structure

```
src/features/workflow/
├── types/
│   └── workflow.ts           # Type definitions and stage metadata
├── utils/
│   └── workflowUtils.ts      # Pure utility functions
├── hooks/
│   └── useWorkflowStage.ts   # React hook for stage access
├── components/
│   ├── WorkflowStageBadge.tsx       # Badge component
│   ├── WorkflowProgressStepper.tsx  # Progress stepper component
│   └── WorkflowStageCard.tsx        # Card with full progress
├── index.ts                  # Public exports
└── README.md                 # This file
```

## Usage

### Basic Usage - Hook

```tsx
import { useWorkflowStage } from '@/features/workflow';

function ProjectView({ project }) {
  const { currentStage, display, progress } = useWorkflowStage({
    projectStatus: project.status.status,
    hasOffers: project.offers?.length > 0,
    offerAccepted: project.status.status === 'offer_accepted',
    hasContract: !!project.contract,
    contractStatus: project.contract?.status,
    userRole: 'owner', // or 'contractor'
  });

  return (
    <div>
      <h3>Current Stage: {display.label}</h3>
      <p>{display.description}</p>
      <p>Progress: {progress.progressPercentage}%</p>
    </div>
  );
}
```

### Component - Stage Badge

Display a simple badge with the current stage:

```tsx
import { WorkflowStageBadge } from '@/features/workflow';

function ProjectCard({ project, userRole }) {
  return (
    <div>
      <h1>{project.title}</h1>
      <WorkflowStageBadge
        projectStatus={project.status.status}
        userRole={userRole}
        showIcon={true}
        size="sm"
      />
    </div>
  );
}
```

### Component - Progress Stepper

Display full workflow progress with all stages:

```tsx
import { WorkflowProgressStepper } from '@/features/workflow';

function ProjectProgress({ project, userRole }) {
  return (
    <WorkflowProgressStepper
      projectStatus={project.status.status}
      hasOffers={project.offers?.length > 0}
      offerAccepted={project.status.status === 'offer_accepted'}
      hasContract={!!project.contract}
      contractStatus={project.contract?.status}
      userRole={userRole}
      variant="horizontal" // or "vertical"
      showLabels={true}
    />
  );
}
```

### Component - Full Stage Card

Complete card component with stage badge and optional stepper:

```tsx
import { WorkflowStageCard } from '@/features/workflow';

function ProjectOverview({ project, userRole }) {
  return (
    <WorkflowStageCard
      projectStatus={project.status.status}
      hasOffers={project.offers?.length > 0}
      offerAccepted={project.status.status === 'offer_accepted'}
      hasContract={!!project.contract}
      contractStatus={project.contract?.status}
      userRole={userRole}
      title="Project Stage"
      showStepper={true}
      stepperVariant="horizontal"
    />
  );
}
```

## Integration Points

### Project Feature
- **ProjectCard**: Shows stage badge in header
- **ProjectOverview**: Shows full stage card with stepper

### Offers Feature
- **OfferDetails**: Shows stage badge in header with offer-aware status

### Contract Feature
- **ContractViewer**: Shows stage badge in header with contract-aware status

## API

### Types

```typescript
type WorkflowStage =
  | "project_creation"
  | "awaiting_offers"
  | "offer_review"
  | "contract_negotiation"
  | "contract_signing"
  | "project_execution"
  | "project_completion"
  | "project_closed";

interface WorkflowProgress {
  currentStage: WorkflowStage;
  currentStageOrder: number;
  totalStages: number;
  completedStages: number;
  progressPercentage: number;
  nextStage?: WorkflowStage;
  previousStage?: WorkflowStage;
  isComplete: boolean;
}
```

### Utility Functions

```typescript
// Determine current stage from data
determineCurrentStage(params: {
  projectStatus: string;
  hasOffers?: boolean;
  offerAccepted?: boolean;
  hasContract?: boolean;
  contractStatus?: string;
}): WorkflowStage;

// Calculate progress information
calculateWorkflowProgress(currentStage: WorkflowStage): WorkflowProgress;

// Check user permissions
canUserViewStage(stage: WorkflowStage, userRole: "owner" | "contractor"): boolean;

// Get stage display colors
getStageColorClass(stage: WorkflowStage): string;
getStageBorderColorClass(stage: WorkflowStage): string;
getStageBackgroundColorClass(stage: WorkflowStage): string;

// Format for display
formatStageDisplay(stage: WorkflowStage, locale: "en" | "ar"): {
  label: string;
  description: string;
};
```

### Hook Return Type

```typescript
interface UseWorkflowStageReturn {
  currentStage: WorkflowStage;
  stageDefinition: StageDefinition;
  progress: WorkflowProgress;
  display: {
    label: string;
    description: string;
    colorClass: string;
    borderColorClass: string;
    backgroundColorClass: string;
  };
  canView: boolean;
}
```

## Localization

The workflow feature supports both English and Arabic:
- Stage labels and descriptions are provided in both languages
- Automatically uses current locale via `next-intl`
- RTL-friendly component layout

## Styling

All components use:
- Tailwind CSS classes
- Dark mode support
- Consistent design tokens
- Responsive layouts
- Accessible color contrasts

## Stage Color Scheme

- **Project Creation**: Blue
- **Awaiting Offers**: Orange
- **Reviewing Offers**: Purple
- **Contract Negotiation**: Yellow
- **Contract Signing**: Indigo
- **Project Execution**: Green
- **Project Completion**: Teal
- **Project Closed**: Gray

## Best Practices

1. **Always pass userRole** when available for proper permission checking
2. **Provide all available data** to `determineCurrentStage` for accurate stage detection
3. **Use components over raw hooks** for consistent UI/UX
4. **Consider context** when choosing between badge, stepper, or full card
5. **Keep workflow logic pure** - no side effects or API calls

## Examples in Codebase

### Owner View - Project Card
```typescript
// src/features/project/components/display/ProjectCard.tsx
<WorkflowStageBadge
  projectStatus={project.status.status}
  userRole="owner"
  showIcon={true}
  size="sm"
/>
```

### Contractor View - Offer Details
```typescript
// src/features/offers/components/common/OfferDetails.tsx
<WorkflowStageBadge
  projectStatus={projectStatus}
  hasOffers={true}
  offerAccepted={offer.status === "accepted"}
  userRole="contractor"
  showIcon={true}
  size="md"
/>
```

### Contract View
```typescript
// src/features/contract/components/ContractViewer.tsx
<WorkflowStageBadge
  projectStatus={projectStatus}
  hasContract={true}
  contractStatus={contract.status}
  offerAccepted={true}
  userRole={userRole}
  showIcon={true}
  size="sm"
/>
```

## Future Enhancements

Potential additions (when needed):
- Stage-specific actions/CTAs
- Estimated time in each stage
- Stage transition history
- Custom stage events/notifications
- Stage-based permissions/guards

## Troubleshooting

**Q: Stage not updating after status change?**
A: Ensure you're passing updated data to the hook/component. The workflow is reactive to prop changes.

**Q: Wrong stage being shown?**
A: Check all parameters being passed. The stage determination logic follows a specific priority order (see `workflowUtils.ts`).

**Q: Colors not showing correctly?**
A: Ensure Tailwind classes are properly configured and dark mode is set up correctly.

## Contributing

When adding new stages or modifying logic:
1. Update `WORKFLOW_STAGES` in `types/workflow.ts`
2. Update `determineCurrentStage` logic in `utils/workflowUtils.ts`
3. Update this README with new stage information
4. Test with all user roles (owner/contractor)
5. Verify in both light and dark modes
6. Check both English and Arabic localizations
