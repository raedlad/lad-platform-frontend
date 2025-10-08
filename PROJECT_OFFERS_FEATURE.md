# Project Offers Feature

## Overview
Professional project offers page that displays all offers received for a specific project. Follows enterprise-level design patterns with clean UI, proper loading states, and comprehensive error handling.

## Route
```
/dashboard/individual/projects/{projectId}/offers
```

## Features

### ✅ Core Functionality
- **Display Project Offers**: Shows all offers received for a specific project
- **Real-time Filtering**: Filter by offer status (pending, accepted, rejected)
- **Smart Sorting**: Sort by newest, oldest, highest amount, lowest amount
- **Pagination**: Handle large numbers of offers efficiently
- **Responsive Design**: Optimized for all screen sizes

### ✅ User Experience
- **Loading States**: Professional skeleton loading indicators
- **Empty States**: Informative messages when no offers exist
- **Error Handling**: Graceful error messages with retry options
- **Clean Layout**: Modern card-based design following big company standards

### ✅ API Integration
- **Endpoint**: `GET /owner/projects/{projectId}/offers`
- **Mock Support**: Falls back to mock data in development mode
- **Service Layer**: Clean separation using `individualOffersApi.getProjectOffers()`

## Technical Implementation

### Files Created/Modified

1. **Page Component**: `src/app/dashboard/individual/projects/[id]/offers/page.tsx`
   - Clean, professional React component
   - Uses Next.js App Router with dynamic routing
   - Implements proper state management

2. **API Service**: `src/features/offers/services/individualOffersApi.ts`
   - Added `getProjectOffers()` method
   - Supports both production API and development mock data
   - Proper TypeScript typing

3. **Translations**: 
   - `src/messages/en.json` - English translations
   - `src/messages/ar.json` - Arabic translations
   - All necessary keys added for i18n support

### Key Components Used
- **OfferCard**: Reusable offer card component
- **Shadcn/UI**: Select, Button components for consistent UI
- **Lucide Icons**: Filter, Package, Loader2, SlidersHorizontal
- **next-intl**: Full internationalization support

## Usage Example

```typescript
// Navigate to project offers
router.push(`/dashboard/individual/projects/${projectId}/offers`);

// Or use Link component
<Link href={`/dashboard/individual/projects/${projectId}/offers`}>
  View Offers
</Link>
```

## Design Principles Applied

### Clean Code ✅
- Single responsibility for each function
- Meaningful variable names
- No magic numbers
- Proper separation of concerns

### Code Quality ✅
- No unnecessary confirmations
- Preserves existing code structure
- Single chunk edits
- Real file links

### UI/UX Best Practices ✅
- Mobile-first responsive design
- Proper spacing and alignment
- Consistent color scheme
- Accessible components
- Loading and error states

## Translation Keys

### English
- `offers.projectOffers.title` - "Project Offers"
- `offers.projectOffers.description` - "Review and manage all offers..."
- `offers.projectOffers.totalOffers` - "offers received"
- `offers.projectOffers.noOffers` - "No offers yet"
- `offers.sort.newest` - "Newest First"
- `offers.filters.status` - "Status"

### Arabic
- Full Arabic translations provided for RTL support

## Future Enhancements

- [ ] Bulk actions for multiple offers
- [ ] Export offers to PDF/Excel
- [ ] Advanced filtering (amount range, date range)
- [ ] Offer comparison view
- [ ] Real-time notifications for new offers

## Testing Routes

To test the page:
1. Navigate to `/dashboard/individual/projects/{any-project-id}/offers`
2. Mock data will be displayed in development mode
3. Test filtering by status
4. Test sorting options
5. Verify pagination works correctly

## Notes

- Page automatically handles project ID from URL parameters
- Falls back to mock data in development environment
- All strings are internationalized
- Follows project's established patterns and conventions
- Fully responsive and accessible
