# Internationalization (i18n) Setup

This project uses `next-intl` for internationalization without locale-prefixed URLs. All routes remain clean (e.g., `/login`, `/dashboard`) while supporting multiple languages internally.

## Features

- ✅ **No URL routing**: All routes remain clean without `/en` or `/ar` prefixes
- ✅ **Cookie-based persistence**: User language preference is saved in `NEXT_LOCALE` cookie
- ✅ **Browser language detection**: Falls back to browser's `Accept-Language` header
- ✅ **Dynamic HTML attributes**: `<html lang="...">` and `dir="..."` are set automatically
- ✅ **RTL support**: Full right-to-left support for Arabic
- ✅ **Type-safe**: Full TypeScript support with locale types

## File Structure

```
src/
├── i18n.ts                    # Main i18n configuration and utilities
├── messages/
│   ├── en.json               # English translations
│   └── ar.json               # Arabic translations
├── components/
│   ├── I18nProvider.tsx      # Provider component for the app
│   ├── LanguageSwitcher.tsx  # Language switching component
│   └── DemoTranslation.tsx   # Example usage component
├── hooks/
│   └── useLocale.ts          # Custom hook for locale management
└── app/
    └── layout.tsx            # Root layout with i18n setup
```

## How It Works

### 1. Locale Detection Priority
1. **Cookie**: `NEXT_LOCALE` cookie (highest priority)
2. **Browser**: `Accept-Language` header
3. **Default**: English (`en`)

### 2. Server-Side Rendering
- `getLocale()` function runs on the server
- HTML `lang` and `dir` attributes are set dynamically
- Messages are loaded based on detected locale

### 3. Client-Side Updates
- Language switcher updates the cookie
- Page refreshes to apply new locale
- All components re-render with new translations

## Usage Examples

### Basic Translation
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('auth.title')}</h1>
      <p>{t('auth.subtitle')}</p>
    </div>
  );
}
```

### Namespaced Translations
```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const authT = useTranslations('auth');
  const commonT = useTranslations('common');
  
  return (
    <div>
      <button>{commonT('submit')}</button>
      <button>{authT('login')}</button>
    </div>
  );
}
```

### Using the Locale Hook
```tsx
import { useLocale } from '@/hooks/useLocale';

export default function MyComponent() {
  const { currentLocale, changeLocale, isRTL } = useLocale();
  
  return (
    <div>
      <p>Current language: {currentLocale}</p>
      <p>Text direction: {isRTL ? 'RTL' : 'LTL'}</p>
      <button onClick={() => changeLocale('ar')}>
        Switch to Arabic
      </button>
    </div>
  );
}
```

## Adding New Languages

### 1. Create Message File
Create `src/messages/[locale].json` with your translations.

### 2. Update Locales Array
Add the new locale to the `locales` array in `src/i18n.ts`:

```typescript
export const locales = ['en', 'ar', 'fr'] as const;
```

### 3. Update Type Definitions
The `Locale` type will automatically include the new locale.

## Message File Structure

Messages are organized in nested objects for better organization:

```json
{
  "common": {
    "loading": "Loading...",
    "submit": "Submit"
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up"
  }
}
```

Access nested messages using dot notation:
```tsx
t('auth.login')        // "Login"
t('common.loading')    // "Loading..."
```

## Language Switcher

The `LanguageSwitcher` component:
- Shows current language with flag and name
- Allows switching between available languages
- Updates the cookie and refreshes the page
- Is already integrated into the header

## RTL Support

Arabic (`ar`) automatically gets RTL support:
- `dir="rtl"` attribute on HTML element
- CSS classes for RTL-specific styling
- `isRTL` boolean from `useLocale()` hook

## Best Practices

1. **Always use the `useTranslations` hook** instead of hardcoded strings
2. **Organize messages logically** in nested objects
3. **Use descriptive keys** that make sense in context
4. **Test both languages** to ensure proper RTL layout
5. **Keep translations concise** and clear

## Troubleshooting

### Translations not updating
- Check that the cookie is being set correctly
- Ensure the page is refreshing after locale change
- Verify message files are in the correct location

### RTL layout issues
- Check that `dir` attribute is set correctly
- Use CSS logical properties when possible
- Test with both LTR and RTL content

### Build errors
- Ensure all locales in the `locales` array have corresponding message files
- Check that message files are valid JSON
- Verify import paths are correct

## Migration from URL-based i18n

If migrating from a URL-based i18n system:

1. Remove locale prefixes from all routes
2. Update `next.config.js` to remove i18n routing
3. Replace locale detection logic with the new `getLocale()` function
4. Update any hardcoded locale references
5. Test that all translations work correctly
