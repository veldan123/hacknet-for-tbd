# HACKNET — Setup Guide

## Quick Setup (Firebase Required)

### 1. Create a Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `hacknet` → Continue
3. Disable Google Analytics (not needed) → Create project

### 2. Enable Realtime Database
1. In your project → **Build** → **Realtime Database** → Create database
2. Choose a region → Start in **test mode** (allows all reads/writes)
3. Copy the database URL (looks like `https://hacknet-xxxxx-default-rtdb.firebaseio.com`)

### 3. Get Your Config
1. Project Settings (⚙️ gear icon) → **General** tab
2. Scroll to "Your apps" → Click `</>` (Web) → Register app (name: `hacknet-web`)
3. Copy the `firebaseConfig` object values

### 4. Enable Cloud Messaging (for push notifications)
1. Project Settings → **Cloud Messaging** tab
2. Scroll to **Web Push certificates** → **Generate key pair**
3. Copy the **Key pair** value (this is your VAPID key)

### 5. Edit Both Files
Open `index.html` and `firebase-messaging-sw.js`, replace all `REPLACE_WITH_YOUR_*` values:

```javascript
const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "hacknet-xxxxx.firebaseapp.com",
  databaseURL:       "https://hacknet-xxxxx-default-rtdb.firebaseio.com",
  projectId:         "hacknet-xxxxx",
  storageBucket:     "hacknet-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};
const VAPID_KEY = "BNy...your_vapid_key...";
```

### 6. Deploy to GitHub Pages
1. Create a new GitHub repo called `hacknet`
2. Push both files to the repo root
3. Repo Settings → **Pages** → Source: **Deploy from a branch** → Branch: `main` / `/(root)`
4. Your site will be at `https://YOUR_USERNAME.github.io/hacknet/`

### 7. Fix Service Worker Path for GitHub Pages
Since GitHub Pages serves from `/hacknet/` subdirectory, update `index.html` line:
```javascript
const reg = await navigator.serviceWorker.register('/hacknet/firebase-messaging-sw.js');
```

---

## Database Security Rules (after testing)
Once everyone has accounts, replace test rules with:
```json
{
  "rules": {
    "players": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    },
    "activeHacks": {
      ".read": true,
      ".write": true
    }
  }
}
```

---

## How to Play

| Action | Cost | Effect |
|--------|------|--------|
| Hack a friend (reveal password) | 1000 CR | See their current password |
| Infiltrate (enter stolen password) | Free | Access their balance |
| Steal credits | Time | 1 min wait per 100 CR stolen |
| Intercept | Free | Kick hacker out, must change password |
| Hourly bonus | — | +1000 CR every hour automatically |

## Tips
- Change your password regularly — anyone who bought it before the change still has the old one
- If you get a breach notification, hit **INTERCEPT** fast before they finish stealing
- The hacker sees a live countdown — if you intercept mid-steal they get nothing
