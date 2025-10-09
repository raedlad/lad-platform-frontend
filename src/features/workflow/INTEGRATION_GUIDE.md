# Workflow Integration Guide

## How to Connect UI with Workflow

This guide shows you how to integrate workflow-aware navigation into your UI components.

## Overview

The workflow feature provides:
1. **Stage Detection** - Automatically determines current stage from project data
2. **Smart Navigation** - Routes users to the appropriate page based on stage
3. **Dynamic Button Text** - Action buttons show context-aware labels

## Basic Integration Pattern

### Step 1: Import the Hook

```tsx
import { useWorkflowNavigation } from '@/features/workflow';
```

### Step 2: Use the Hook in Your Component

```tsx
function MyComponent({ project, userRole }) {
  const { stageRoute, actionButtonText, navigateToCurrentStage } = useWorkflowNavigation({
    projectId: project.id,
    projectStatus: project.status.status,
    hasOffers: project.offers?.length > 0,
    offerAccepted: project.status.status === 'offer_accepted',
    hasContract: !!project.contract,
    contractStatus: project.contract?.status,
    userRole: userRole, // 'owner' or 'contractor'
    contractId: project.contract?.id,
  });

  return (
    <Link href={stageRoute.path}>
      <Button>{actionButtonText}</Button>
    </Link>
  );
}
```

## Real-World Example: ProjectCard Component

Here's the complete integration in the ProjectCard component:

```tsx
import { WorkflowStageBadge, useWorkflowNavigation } from '@/features/workflow';

interface ProjectCardProps {
  project: Project;
  userRole?: "owner" | "contractor";
  hasOffers?: boolean;
  offerAccepted?: boolean;
  hasContract?: boolean;
  contractStatus?: string;
  contractId?: string | number;
}

export function ProjectCard({
  project,
  userRole = "owner",
  hasOffers,
  offerAccepted,
  hasContract,
  contractStatus,
  contractId,
}: ProjectCardProps) {
  // 1. Get workflow navigation data
  const { stageRoute, actionButtonText } = useWorkflowNavigation({
    projectId: project.id,
    projectStatus: project.status.status,
    hasOffers,
    offerAccepted,
    hasContract,
    contractStatus,
    userRole,
    contractId,
  });

  return (
    <article>
      <header>
        <h1>{project.title}</h1>
        {/* 2. Show current stage badge */}
        <WorkflowStageBadge
          projectStatus={project.status.status}
          userRole={userRole}
          showIcon={true}
          size="sm"
        />
      </header>

      {/* Project details... */}

      <footer>
        {/* 3. Workflow-aware navigation button */}
        <Link href={stageRoute.path}>
          <Button variant="outline">
            {actionButtonText}
            <ArrowRight />
          </Button>
        </Link>
      </footer>
    </article>
  );
}
```

## Navigation Routes by Stage

The workflow automatically determines the correct route:

| Stage | Owner Route | Contractor Route | Action |
|-------|-------------|------------------|--------|
| Project Creation | `/projects/{id}/edit` | N/A | Complete Setup |
| Awaiting Offers | `/projects/{id}/offers` | `/projects/{id}` | View Offers |
| Offer Review | `/projects/{id}/offers` | `/projects/{id}/offers` | Review Offers |
| Contract Negotiation | `/contracts/{id}` | `/contracts/{id}` | View Contract |
| Contract Signing | `/contracts/{id}` | `/contracts/{id}` | Sign Contract |
| Project Execution | `/projects/{id}/execution` | `/projects/{id}/execution` | Monitor Progress |
| Project Completion | `/projects/{id}/completion` | `/projects/{id}/completion` | Final Review |
| Project Closed | `/projects/{id}` | `/projects/{id}` | View Details |

## Passing Data to Components

### From Project List Page

```tsx
// pages/projects/index.tsx
import { ProjectCard } from '@/features/project/components/display/ProjectCard';

function ProjectsListPage() {
  const projects = useProjects();
  const userRole = useAuthStore(state => state.user?.role);

  return (
    <div>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          userRole={userRole}
          // Pass additional workflow data
          hasOffers={project.offers?.length > 0}
          offerAccepted={project.acceptedOffer !== null}
          hasContract={project.contract !== null}
          contractStatus={project.contract?.status}
          contractId={project.contract?.id}
        />
      ))}
    </div>
  );
}
```

### Getting Data from API Response

If your API returns project data with offers and contracts:

```tsx
// Transform API response to workflow parameters
const transformProjectData = (apiProject: any) => ({
  project: apiProject,
  hasOffers: apiProject.offers?.length > 0,
  offerAccepted: apiProject.accepted_offer !== null,
  hasContract: apiProject.contract !== null,
  contractStatus: apiProject.contract?.status,
  contractId: apiProject.contract?.id,
});

// Use in component
const projectData = transformProjectData(apiResponse);
<ProjectCard {...projectData} userRole={userRole} />
```

## Button Action Text Translations

The workflow automatically provides localized button text:

### English
- Project Creation → "Complete Setup"
- Awaiting Offers → "View Offers"
- Offer Review → "Review Offers"
- Contract Negotiation → "View Contract"
- Contract Signing → "Sign Contract"
- Project Execution → "Monitor Progress"
- Project Completion → "Final Review"
- Project Closed → "View Details"

### Arabic
- Project Creation → "إكمال الإعداد"
- Awaiting Offers → "عرض العروض"
- Offer Review → "مراجعة العروض"
- Contract Negotiation → "عرض العقد"
- Contract Signing → "توقيع العقد"
- Project Execution → "متابعة التقدم"
- Project Completion → "المراجعة النهائية"
- Project Closed → "عرض التفاصيل"

## Programmatic Navigation

You can also navigate programmatically without using Link components:

```tsx
import { useRouter } from 'next/navigation';
import { useWorkflowNavigation } from '@/features/workflow';

function MyComponent({ project }) {
  const { navigateToCurrentStage, stageRoute } = useWorkflowNavigation({
    projectId: project.id,
    projectStatus: project.status.status,
    userRole: 'owner',
  });

  const handleClick = () => {
    // Navigate to the appropriate stage
    navigateToCurrentStage();
    
    // Or check the route first
    console.log('Will navigate to:', stageRoute.path);
    console.log('User should:', stageRoute.action);
  };

  return <button onClick={handleClick}>Go to Current Stage</button>;
}
```

## Advanced: Direct Route Calculation

For cases where you need the route without a React component:

```tsx
import { getWorkflowRoute } from '@/features/workflow';

// Get route information
const routeInfo = getWorkflowRoute({
  projectId: '123',
  projectStatus: 'published',
  hasOffers: false,
  userRole: 'owner',
});

console.log(routeInfo.path); // '/dashboard/individual/projects/123/offers'
console.log(routeInfo.action); // 'view_incoming_offers'
```

## Common Patterns

### Pattern 1: Card with Stage Badge and Smart Button

```tsx
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <h3>{project.title}</h3>
      <WorkflowStageBadge
        projectStatus={project.status.status}
        hasOffers={hasOffers}
        userRole={userRole}
      />
    </div>
  </CardHeader>
  <CardContent>
    {/* Project details */}
  </CardContent>
  <CardFooter>
    <Link href={stageRoute.path}>
      <Button>{actionButtonText}</Button>
    </Link>
  </CardFooter>
</Card>
```

### Pattern 2: Dashboard Widget with Progress

```tsx
<WorkflowStageCard
  projectStatus={project.status.status}
  hasOffers={hasOffers}
  offerAccepted={offerAccepted}
  hasContract={hasContract}
  contractStatus={contractStatus}
  userRole={userRole}
  showStepper={true}
  stepperVariant="horizontal"
/>
```

### Pattern 3: Conditional Rendering Based on Stage

```tsx
const { currentStage } = useWorkflowStage({
  projectStatus: project.status.status,
  userRole: 'owner',
});

return (
  <div>
    {currentStage === 'awaiting_offers' && (
      <Alert>Waiting for contractors to submit offers</Alert>
    )}
    
    {currentStage === 'offer_review' && (
      <Alert>You have offers to review!</Alert>
    )}
    
    {currentStage === 'contract_signing' && (
      <Alert>Contract is ready for your signature</Alert>
    )}
  </div>
);
```

## Troubleshooting

### Issue: Button shows "View Details" for all stages
**Solution**: Make sure you're passing all required parameters (`hasOffers`, `offerAccepted`, `hasContract`, etc.)

### Issue: Navigation goes to wrong page
**Solution**: Verify that `projectStatus` matches the expected values from your backend

### Issue: Button text not in correct language
**Solution**: The hook uses `next-intl`'s `useLocale()`. Ensure your locale is set correctly

### Issue: TypeScript errors
**Solution**: Import types from the workflow feature:
```tsx
import type { UseWorkflowNavigationParams } from '@/features/workflow';
```

## Best Practices

1. **Always pass userRole** - This ensures correct routing for owners vs contractors
2. **Fetch complete data** - Get offers, contracts info when loading projects
3. **Use the hook** - Don't manually construct routes, let the workflow determine them
4. **Show stage badges** - Help users understand where they are in the process
5. **Handle loading states** - Show skeleton/loading while fetching workflow data

## Testing Your Integration

```tsx
// Test different stages
const testStages = [
  { status: 'draft', hasOffers: false, expected: 'Complete Setup' },
  { status: 'published', hasOffers: false, expected: 'View Offers' },
  { status: 'published', hasOffers: true, expected: 'Review Offers' },
  { status: 'offer_accepted', hasContract: true, expected: 'View Contract' },
];

testStages.forEach(test => {
  const { actionButtonText } = useWorkflowNavigation({
    projectId: '1',
    projectStatus: test.status,
    hasOffers: test.hasOffers,
    hasContract: test.hasContract,
    userRole: 'owner',
  });
  
  console.assert(
    actionButtonText === test.expected,
    `Expected "${test.expected}" but got "${actionButtonText}"`
  );
});
```

## Full Example: Projects List Page

```tsx
// app/[locale]/dashboard/individual/projects/page.tsx
'use client';

import { useProjectStore } from '@/features/project/store/projectStore';
import { ProjectCard } from '@/features/project/components/display/ProjectCard';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function ProjectsPage() {
  const projects = useProjectStore(state => state.projects);
  const user = useAuthStore(state => state.user);
  const userRole = user?.role === 'client' ? 'owner' : 'contractor';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          userRole={userRole}
          hasOffers={project.offers?.length > 0}
          offerAccepted={project.status.status === 'offer_accepted'}
          hasContract={!!project.contract}
          contractStatus={project.contract?.status}
          contractId={project.contract?.id}
          getProjectTypeName={(id) => getTypeName(id)}
          getStatusText={(proj) => getStatus(proj)}
        />
      ))}
    </div>
  );
}
```

This integration ensures your UI always knows where to send users based on the current project stage! 🚀
