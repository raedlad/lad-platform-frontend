# 🔤 Arabic Font Setup Guide

## Current Status
✅ **Arabic PDF generator is ready!**  
⚠️ **Fonts need to be converted and added**

## Step-by-Step Instructions

### 1. Convert WOFF2 to TTF
**Option A: Online Converter (Recommended)**
1. Go to: https://convertio.co/woff2-ttf/
2. Upload these files from `public/fonts/`:
   - `Tajawal-Regular.woff2`
   - `Tajawal-Bold.woff2`
3. Download the converted TTF files

**Option B: Command Line**
```bash
# Install fonttools
pip install fonttools[woff]

# Convert fonts
fonttools ttLib.woff2 decompress public/fonts/Tajawal-Regular.woff2
fonttools ttLib.woff2 decompress public/fonts/Tajawal-Bold.woff2
```

### 2. Convert TTF to Base64
1. Go to: https://base64.guru/converter/encode/file
2. Upload `Tajawal-Regular.ttf`
3. Copy the base64 string
4. Repeat for `Tajawal-Bold.ttf`

### 3. Update Font Converter
Replace the placeholder strings in `src/features/contract/utils/fontConverter.ts`:

```typescript
export const TajawalRegularBase64 = `
data:font/truetype;charset=utf-8;base64,YOUR_BASE64_STRING_HERE
`;

export const TajawalBoldBase64 = `
data:font/truetype;charset=utf-8;base64,YOUR_BASE64_STRING_HERE
`;
```

## What Happens Now

### Without Fonts (Current State)
- ✅ PDF generates successfully
- ✅ Arabic text is translated to English
- ✅ Bilingual layout (English + translations)
- ⚠️ Arabic shows as: "Three-Story Residential Building" instead of "عمارة سكنية ثلاث طوابق"

### With Fonts (After Setup)
- ✅ PDF generates successfully  
- ✅ Real Arabic text rendering
- ✅ Proper Arabic fonts (Tajawal)
- ✅ True bilingual support

## Test the Current Version

1. Click "Download PDF" 
2. Check console logs for:
   ```
   ⚠️ Tajawal fonts not available, using fallback
   ⚠️ Arabic text detected but no font available
   ```
3. PDF will show English translations instead of Arabic

## After Font Setup

Console will show:
```
✅ Tajawal Arabic fonts loaded successfully!
🔤 Using Arabic font for: "عمارة سكنية ثلاث طوابق..."
🔤 Rendering Arabic text with Tajawal font
```

## Quick Test

Try downloading the PDF now - it should work with English translations!
Then follow the font setup steps above for full Arabic support.
