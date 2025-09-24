# Project Creation Flow Guide

This guide explains the enhanced project creation flow that follows clean code principles and proper state management patterns.

## Overview

The project creation system is built with a multi-step wizard approach using:
- **Zustand** for state management
- **TypeScript** for type safety
- **Fake API** for debugging and development
- **Clean architecture** with separation of concerns

## Architecture

### Stores

#### 1. ProjectStore (`src/features/project/store/projectStore.ts`)
Manages the current project creation session:
- Project data and metadata
- Step management (current step, completed steps)
- Form data validation and change detection
- Document and BOQ management
- Project creation flow state

#### 2. ProjectsStore (`src/features/project/store/ProjectsStore.ts`)
Manages the list of all user projects:
- Project list operations (add, update, remove)
- Loading and error states
- Project status management

### Services

#### ProjectAPI (`src/features/project/services/projectApi.ts`)
Handles all API communications with consistent error handling:
- Project creation and updates
- File uploads and management
- BOQ operations
- Publish settings
- Review submission

### Hooks

#### useCreateProject (`src/features/project/hooks/useCreateProject.ts`)
Main hook for project creation operations:
- Form submission handlers
- File management
- Step navigation
- Project completion

## Usage

### Basic Project Creation

```tsx
import { useCreateProject } from "@/features/project/hooks/useCreateProject";

function MyComponent() {
  const {
    loading,
    error,
    project,
    projectId,
    currentStep,
    completedSteps,
    submitEssentialInfo,
    submitSendProjectToReview,
    resetProjectCreation,
  } = useCreateProject();

  const handleCreateProject = async () => {
    const result = await submitEssentialInfo({
      name: "My Project",
      type: 1,
      city: "Riyadh",
      district: "Al Olaya",
      location: "King Fahd Road",
      budget: 100000,
      budget_unit: "SAR",
      duration: 6,
      duration_unit: "months",
      area_sqm: 500,
      description: "Project description",
    });

    if (result.success) {
      console.log("Project created successfully");
    }
  };

  return (
    <div>
      <button onClick={handleCreateProject} disabled={loading}>
        {loading ? "Creating..." : "Create Project"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Project List Management

```tsx
import { useProjectsStore } from "@/features/project/store/ProjectsStore";

function ProjectsList() {
  const { projects, isLoading, error } = useProjectsStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map((userProject) => (
        <div key={userProject.project.id}>
          <h3>{userProject.project.essential_info.name}</h3>
          <p>{userProject.project.essential_info.city}</p>
          <p>Status: {userProject.project.status.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## Project Creation Steps

1. **Essential Info** - Basic project information
2. **Classification** - Job type, work type, and level
3. **Documents** - File uploads for plans, licenses, etc.
4. **BOQ** - Bill of Quantities
5. **Publish Settings** - Notification and review settings
6. **Review** - Submit for review

## Key Features

### State Management
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Change Detection**: Only saves when data actually changes
- **Step Management**: Tracks progress through creation flow
- **Error Handling**: Consistent error states and messages

### File Management
- **Upload Progress**: Real-time upload status
- **Error Recovery**: Retry failed uploads
- **File Validation**: Type and size checking
- **Collection Organization**: Files grouped by category

### Data Persistence
- **Auto-save**: Data saved at each step
- **Draft Recovery**: Can resume incomplete projects
- **Version Control**: Tracks original vs current data

## API Integration

The system uses fake APIs for development. To integrate with real APIs:

1. Replace fake responses in `projectApi.ts`
2. Update error handling for real API responses
3. Add proper authentication headers
4. Implement retry logic for network failures

## Error Handling

All operations return consistent result objects:
```typescript
{
  success: boolean;
  message: string;
  data?: any;
}
```

## Testing

Use the `ProjectCreationExample` component to test the flow:
```tsx
import { ProjectCreationExample } from "@/features/project/components/ProjectCreationExample";

// In your page/component
<ProjectCreationExample />
```

## Best Practices

1. **Always check `result.success`** before proceeding
2. **Handle loading states** to prevent double submissions
3. **Display error messages** to users
4. **Reset state** when starting new projects
5. **Validate data** before API calls
6. **Use TypeScript** for type safety

## Troubleshooting

### Common Issues

1. **Project not created**: Check if `projectId` is set after essential info
2. **Files not uploading**: Verify file types and sizes
3. **State not updating**: Ensure proper dependency arrays in hooks
4. **API errors**: Check network and server responses

### Debug Tools

- Use browser dev tools to inspect Zustand stores
- Check console for API response logs
- Verify form data before submission
- Test with different file types and sizes
