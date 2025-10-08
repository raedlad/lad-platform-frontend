# 🔤 TTF Font Setup for Arabic PDF

## Current Status
✅ **PDF Generator is ready for TTF fonts!**  
✅ **Two methods available**: Direct TTF loading or Base64 embedding

## Method 1: Direct TTF Files (Easiest)

### Step 1: Convert WOFF2 to TTF
1. Go to: **https://convertio.co/woff2-ttf/**
2. Upload these files from `public/fonts/`:
   - `Tajawal-Regular.woff2` 
   - `Tajawal-Bold.woff2`
3. Download the converted TTF files

### Step 2: Place TTF Files
Copy the TTF files to your public folder:
```
public/
  fonts/
    Tajawal-Regular.ttf  ← Add this
    Tajawal-Bold.ttf     ← Add this
    Tajawal-Regular.woff2 (existing)
    Tajawal-Bold.woff2   (existing)
    ...
```

### Step 3: Test
1. Click "Download PDF"
2. Check console for: `✅ Tajawal fonts loaded from TTF files!`
3. PDF will show real Arabic text!

## Method 2: Base64 Embedding (Alternative)

### Step 1: Convert TTF to Base64
1. Convert WOFF2 to TTF (as above)
2. Go to: **https://base64.guru/converter/encode/file**
3. Upload `Tajawal-Regular.ttf`
4. Copy the base64 string

### Step 2: Update fontConverter.ts
Replace the placeholder in `src/features/contract/utils/fontConverter.ts`:
```typescript
export const TajawalRegularBase64 = `
data:font/truetype;charset=utf-8;base64,AAABAAEA...YOUR_ACTUAL_BASE64_HERE
`;
```

## What You'll See

### Before TTF Setup:
```
🔤 Attempting to load Arabic fonts...
📁 Attempting to load TTF files from public folder...
⚠️ TTF files not found in public/fonts/
💡 To enable Arabic fonts:
   1. Convert WOFF2 to TTF: https://convertio.co/woff2-ttf/
   2. Place TTF files in public/fonts/
   3. Or convert to base64 and update fontConverter.ts
```

### After TTF Setup:
```
🔤 Attempting to load Arabic fonts...
📁 Attempting to load TTF files from public folder...
✅ Tajawal fonts loaded from TTF files!
🔤 Using Arabic font for: "اتفاقية العقد..."
🔤 Rendering Arabic text with Tajawal font
```

## Quick Start
1. **Convert 2 files**: `Tajawal-Regular.woff2` → `Tajawal-Regular.ttf`
2. **Copy to**: `public/fonts/Tajawal-Regular.ttf`
3. **Test**: Download PDF and check console

That's it! The system will automatically detect and load the TTF fonts. 🚀
