# Firebase Setup Instructions

## Issues Found

1. **Google Sign-In Provider Not Enabled**: The Google authentication provider needs to be enabled in Firebase Console
2. **Data Not Loading**: Need to verify Firebase Realtime Database has the migrated data

## Fix Instructions

### 1. Enable Google Sign-In Provider

**Steps:**
1. Go to Firebase Console: https://console.firebase.google.com/project/cricket-ipl-selector/authentication/providers
2. Click on "Google" in the Sign-in providers list
3. Click "Enable" toggle
4. Add your email as a test user (optional)
5. Click "Save"

**OR use Firebase CLI:**
```bash
# This needs to be done manually in Firebase Console
# The provider must be enabled before Google Sign-In will work
```

### 2. Verify Data Migration

The data migration script may not have run. Let's verify:

**Check Firebase Realtime Database:**
1. Go to: https://console.firebase.google.com/project/cricket-ipl-selector/database/cricket-ipl-selector-default-rtdb/data
2. Check if `teams` and `matches` nodes exist
3. If not, we need to run the migration script again

### 3. Run Migration Script (if needed)

If data is missing, open the application locally and check browser console:
1. Open `c:\flutter_projects\Cricket\index.html` in Chrome
2. Open DevTools (F12)
3. Check Console for errors
4. The migration script should have run automatically

### 4. Alternative: Manual Firebase Console Setup

**Enable Google Provider via Console:**
1. Visit: https://console.firebase.google.com/project/cricket-ipl-selector/authentication/providers
2. Click "Get Started" if Authentication is not initialized
3. Click "Google" provider
4. Toggle "Enable"
5. Save

**Verify Authorized Domains:**
1. Go to Authentication → Settings → Authorized domains
2. Ensure these domains are listed:
   - `localhost`
   - `cricket-ipl-selector.web.app`
   - `cricket-ipl-selector.firebaseapp.com`

## Quick Fix Commands

```bash
# Re-run migration (if data is missing)
# Open index.html and check console

# Re-deploy with fixes
firebase deploy --only hosting,firestore,database
```

## Testing Checklist

- [ ] Google Sign-In provider enabled in Firebase Console
- [ ] Teams data exists in Realtime Database
- [ ] Matches data exists in Realtime Database
- [ ] Authorized domains configured
- [ ] Application loads without console errors
