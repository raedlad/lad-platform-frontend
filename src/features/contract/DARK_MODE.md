# Dark Mode Support for Contract Management Feature

The Contract Management feature now includes comprehensive dark mode support across all components. This document outlines the dark mode implementation and usage.

## 🌙 Dark Mode Features

### Automatic Theme Detection
- Respects system dark mode preferences
- Uses Tailwind CSS `dark:` prefix for dark mode styles
- Seamless transitions between light and dark themes

### Component Coverage
All contract management components support dark mode:

- ✅ **ContractStatusBar** - Progress indicators and status labels
- ✅ **ContractViewer** - Contract details and clauses display
- ✅ **AdditionalClausesEditor** - Clause editing interface
- ✅ **ContractActions** - Action buttons and alerts
- ✅ **NegotiationTimeline** - Timeline and version history
- ✅ **RoleToggle** - Testing role switcher
- ✅ **ContractPage** - Main page layout

## 🎨 Dark Mode Color Scheme

### Background Colors
- **Light Mode**: `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Dark Mode**: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-gray-700`

### Text Colors
- **Primary Text**: `text-gray-900 dark:text-gray-100`
- **Secondary Text**: `text-gray-700 dark:text-gray-300`
- **Muted Text**: `text-muted-foreground dark:text-gray-400`

### Border Colors
- **Default Borders**: `border-gray-200 dark:border-gray-700`
- **Subtle Borders**: `border-gray-300 dark:border-gray-600`

### Status Colors
- **Success**: `bg-green-50 dark:bg-green-900/20`, `border-green-200 dark:border-green-700`
- **Warning**: `bg-yellow-50 dark:bg-yellow-900/20`, `border-yellow-200 dark:border-yellow-700`
- **Error**: `bg-red-50 dark:bg-red-900/20`, `border-red-200 dark:border-red-700`
- **Info**: `bg-blue-50 dark:bg-blue-900/20`, `border-blue-200 dark:border-blue-700`

## 🔧 Implementation Details

### Tailwind CSS Classes
All components use Tailwind's dark mode variant system:

```tsx
// Example: Card with dark mode support
<Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
  <CardContent>
    <h3 className="text-gray-900 dark:text-gray-100">Title</h3>
    <p className="text-gray-700 dark:text-gray-300">Description</p>
  </CardContent>
</Card>
```

### Status Indicators
Progress bars and status elements maintain visual hierarchy in both themes:

```tsx
// Progress bar with dark mode
<div className="bg-gray-200 dark:bg-gray-700">
  <div className="bg-primary" style={{ width: '60%' }} />
</div>
```

### Interactive Elements
Buttons, inputs, and interactive components have appropriate hover states:

```tsx
// Button with dark mode hover states
<Button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
  Action
</Button>
```

## 🚀 Usage

### Enabling Dark Mode
Dark mode is automatically enabled based on:
1. System preference (`prefers-color-scheme: dark`)
2. Manual theme toggle (if implemented in your app)
3. Tailwind CSS dark mode configuration

### Testing Dark Mode
1. **System Toggle**: Change your OS dark mode setting
2. **Browser DevTools**: 
   - Open DevTools → Settings → Appearance → Emulate CSS media
   - Select "prefers-color-scheme: dark"
3. **Manual Class**: Add `dark` class to `<html>` element

### Demo Page
Visit the contract demo page to test dark mode:
```
http://localhost:3000/contract-demo
```

## 📱 Responsive Dark Mode

All dark mode styles are responsive and work across different screen sizes:

```tsx
// Responsive dark mode example
<div className="
  bg-white dark:bg-gray-900 
  md:bg-gray-50 md:dark:bg-gray-800
  lg:bg-gray-100 lg:dark:bg-gray-700
">
  Content
</div>
```

## 🎯 Best Practices

### Color Contrast
- Maintains WCAG AA accessibility standards in both themes
- Uses appropriate contrast ratios for text and backgrounds
- Ensures interactive elements are clearly distinguishable

### Consistency
- Uses consistent color tokens across all components
- Maintains visual hierarchy in both light and dark themes
- Preserves brand colors and primary accent colors

### Performance
- No JavaScript required for theme switching
- CSS-only implementation using Tailwind utilities
- Minimal bundle size impact

## 🔍 Component Examples

### Status Bar Dark Mode
```tsx
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
  <div className="bg-gray-200 dark:bg-gray-700">
    <div className="bg-primary" />
  </div>
</div>
```

### Timeline Dark Mode
```tsx
<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <p className="text-gray-900 dark:text-gray-100">Version comment</p>
</div>
```

### Alert Dark Mode
```tsx
<Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
    Warning message
  </AlertDescription>
</Alert>
```

## 🐛 Troubleshooting

### Common Issues

1. **Dark mode not working**
   - Check Tailwind CSS configuration includes `darkMode: 'class'` or `darkMode: 'media'`
   - Ensure dark mode classes are not being purged

2. **Inconsistent colors**
   - Verify all components use the same color tokens
   - Check for hardcoded colors that don't have dark variants

3. **Poor contrast**
   - Test with accessibility tools
   - Adjust color opacity for better readability

### Debug Tips
```tsx
// Add debug classes to see current theme
<div className="bg-red-500 dark:bg-green-500">
  This will be red in light mode, green in dark mode
</div>
```

## 📚 Resources

- [Tailwind CSS Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Dark Mode Design Principles](https://material.io/design/color/dark-theme.html)

---

**Last Updated**: October 2024  
**Version**: 1.0.0  
**Compatibility**: All modern browsers with CSS custom properties support
