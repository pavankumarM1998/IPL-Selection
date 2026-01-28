# Quick Fix Guide - Firebase Issues

## Problem Summary
1. ❌ Google Sign-In not working → **Authentication not enabled in Firebase Console**
2. ❌ Teams/Matches not loading → **Need to verify data migration**

---

## IMMEDIATE FIX REQUIRED

### Step 1: Enable Firebase Authentication (REQUIRED)

**You MUST do this manually in Firebase Console:**

1. **Open Firebase Console**:
   - Go to: https://console.firebase.google.com/project/cricket-ipl-selector/authentication/providers

2. **Enable Authentication**:
   - If you see "Get Started", click it
   - If Authentication is already initialized, proceed to step 3

3. **Enable Google Provider**:
   - Find "Google" in the list of providers
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"

4. **Verify Authorized Domains** (should be automatic):
   - Go to Authentication → Settings → Authorized domains
   - Ensure these are listed:
     - `localhost`
     - `cricket-ipl-selector.web.app`
     - `cricket-ipl-selector.firebaseapp.com`

---

### Step 2: Verify Data Migration

**Check if data exists:**

1. **Open Realtime Database**:
   - Go to: https://console.firebase.google.com/project/cricket-ipl-selector/database/cricket-ipl-selector-default-rtdb/data

2. **Check for data**:
   - Look for `teams` node (should have 10 teams)
   - Look for `matches` node (should have 74 matches)

3. **If data is missing**:
   - The migration script has been added back to index.html
   - Open the local app (already opened in Chrome)
   - Check browser console (F12) for migration success message
   - Data should upload automatically

---

### Step 3: Re-deploy (After Enabling Auth)

Once you've enabled Google Sign-In in Firebase Console:

```bash
# Remove migration script from index.html first
# Then deploy
firebase deploy --only hosting
```

---

## Testing After Fix

1. **Visit**: https://cricket-ipl-selector.web.app
2. **Check**: Teams and matches should load
3. **Click "Sign In"**: Google Sign-In popup should appear
4. **Sign in**: Should work successfully
5. **Save a squad**: Should save to Firestore

---

## Why This Happened

- Firebase Authentication requires manual activation in Console for security
- Google Sign-In provider must be explicitly enabled
- This cannot be done via CLI or code - it's a security feature

---

## Current Status

✅ Application code is complete
✅ Firebase Hosting deployed
✅ Firestore configured
❌ **Authentication needs manual enable** (you must do this)
⏳ Data migration running (check console)

---

## Next Steps

1. **NOW**: Enable Google Sign-In in Firebase Console (link above)
2. **THEN**: Check if data migrated successfully
3. **FINALLY**: Test the live application

The app will work perfectly once Authentication is enabled!
