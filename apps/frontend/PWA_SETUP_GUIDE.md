# Progressive Web App (PWA) Setup Guide

## ✅ Completed PWA Configuration

Your Smart Fashion Styling app is now configured as a Progressive Web App! Here's what's been set up:

### Core PWA Files Created:

1. **`public/manifest.json`** - Web App manifest with metadata
2. **`src/pwa/sw.js`** - Service Worker for offline support and caching
3. **`src/pwa/utils.js`** - Utility helper functions for PWA features
4. **`index.html`** - Updated with PWA meta tags
5. **`vite.config.js`** - Configured with vite-plugin-pwa
6. **`package.json`** - Updated with vite-plugin-pwa dependency

### PWA Features Enabled:

✅ **Offline Support** - App works without internet connection
✅ **Service Worker** - Caches assets automatically
✅ **Installable App** - "Install app" button on compatible browsers
✅ **Standalone Display** - Launches as full-screen app
✅ **Network-First Strategy** - Uses network when available, falls back to cache
✅ **Image Caching** - Caches images for faster loading
✅ **Asset Caching** - Caches CSS and JavaScript files
✅ **Push Notifications** - Ready for notification support
✅ **Background Sync** - Ready for background data sync
✅ **Periodic Sync** - Ready for periodic background updates

---

## 🎨 Icons & Images Required

You need to add the following icon and image files to `public/icons/` folder:

### Required Icon Files:

```
public/icons/
├── icon-192x192.png                 (192x192 - for installer)
├── icon-512x512.png                 (512x512 - for full resolution)
├── icon-192x192-maskable.png        (192x192 - maskable format)
├── icon-512x512-maskable.png        (512x512 - maskable format)
├── favicon-32x32.png                (32x32 - browser tab)
├── favicon-16x16.png                (16x16 - browser tab)
├── mstile-150x150.png               (150x150 - Windows tiles)
├── screenshot-mobile.png            (540x720 - mobile screenshot)
└── screenshot-desktop.png           (1280x720 - desktop screenshot)
```

### Icon Requirements:

**Regular Icons (any, purpose):**
- **192x192 PNG** - Used for app shortcuts, launcher icons
- **512x512 PNG** - High-resolution version for various devices

**Maskable Icons (purpose: maskable):**
- **192x192 PNG with safe zone** - For adaptive icons on Android
- **512x512 PNG with safe zone** - High-resolution adaptive icon
- Leave 10% padding around the edges for mask safety
- Keep important design within center circle

**Favicon Files:**
- **favicon-32x32.png** - Modern browser tabs
- **favicon-16x16.png** - Older browser tabs

**Windows:**
- **mstile-150x150.png** - Windows Start menu tiles

**Screenshots:**
- **screenshot-mobile.png** (540x720) - Shown during mobile install
- **screenshot-desktop.png** (1280x720) - Shown during desktop install

### Quick Icon Generation Option:

You can use free online tools to generate icons from a base image:
- **Favicon Generator**: https://realfavicongenerator.net/
- **PWA Icon Generator**: https://www.pwabuilder.com/
- **Maskable Icon Editor**: https://maskable.app/

---

## 📦 Installation Steps

### 1. Install Dependencies

```bash
cd apps/frontend
npm install
```

This will install `vite-plugin-pwa` along with other dependencies.

### 2. Add Icons

Copy your icon files to `public/icons/` with the naming convention above.

### 3. Build the App

```bash
npm run build
```

This will generate the service worker automatically during build.

### 4. Test the PWA Locally

```bash
npm install -g serve
serve dist
```

Then open your browser to the served URL and look for the "Install" button.

---

## 🚀 Using PWA Features in Your App

### Import PWA utilities in your React components:

```jsx
import {
  isAppInstalled,
  isOffline,
  showInstallPrompt,
  setupInstallPrompt,
  setupOfflineListener,
  requestNotificationPermission,
  sendNotification,
  getCacheInfo,
  getServiceWorkerStatus
} from '../pwa/utils';
```

### Example: Show Install Prompt

```jsx
import { useEffect, useState } from 'react';
import { setupInstallPrompt, showInstallPrompt } from '../pwa/utils';

export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setupInstallPrompt(() => {
      setCanInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    const success = await showInstallPrompt();
    if (success) {
      setCanInstall(false);
    }
  };

  return canInstall ? (
    <button onClick={handleInstall} className="px-4 py-2 bg-[#7a5a34] text-white rounded">
      📱 Install App
    </button>
  ) : null;
}
```

### Example: Offline Detection

```jsx
import { useEffect, useState } from 'react';
import { setupOfflineListener, isOffline } from '../pwa/utils';

export function OfflineIndicator() {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    setupOfflineListener(
      () => setOffline(true),
      () => setOffline(false)
    );
  }, []);

  return offline ? (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center">
      ⚠️ You're offline - some features may be limited
    </div>
  ) : null;
}
```

### Example: Send Notifications

```jsx
import { requestNotificationPermission, sendNotification } from '../pwa/utils';

async function handleNotificationTest() {
  const granted = await requestNotificationPermission();
  if (granted) {
    await sendNotification('Smart Fashion Update', {
      body: 'New recommendations are available!',
      icon: '/icons/icon-192x192.png',
      tag: 'notification-update'
    });
  }
}
```

---

## 🔧 Caching Strategy

The service worker implements different caching strategies per asset type:

### **Network First** (API calls, HTML):
- Try network first
- Use cache if network fails
- Good for data that changes frequently

### **Cache First** (Images, CSS, JS):
- Use cache first
- Update cache in background
- Good for static assets

### **Stale While Revalidate** (via Workbox):
- Serve cached version immediately
- Update cache in background
- Best user experience

---

## 🧪 Testing PWA Features

### Check Service Worker Status

```javascript
import { getServiceWorkerStatus } from './pwa/utils';

const status = await getServiceWorkerStatus();
console.log(status);
// Output: { status: 'registered', scopeURL: '/', active: 'yes' }
```

### Check Cache Info

```javascript
import { getCacheInfo } from './pwa/utils';

const cacheInfo = await getCacheInfo();
console.log(cacheInfo);
// Output: { 'smart-fashion-v1': { size: 25, entries: [...] } }
```

### Browser DevTools

1. **Chrome/Edge DevTools**:
   - Open DevTools (F12)
   - Go to Application tab → Service Workers
   - Check "Update on reload" for development
   - View cached files under Cache Storage

2. **Offline Testing**:
   - DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - App will continue working with cached data

3. **Install Prompt Testing** (Chrome):
   - DevTools → More tools → Manifest
   - Look for manifest validation
   - Manual install button appears after 30 seconds of usage

---

## 📱 Installation on Different Platforms

### **Android with Chrome**:
1. When PWA is ready, "Install" button appears in address bar
2. Or: Menu → Install app
3. App appears on home screen

### **iOS with Safari** (Limited Support):
1. Open app in Safari
2. Share → Add to Home Screen
3. App works in standalone mode (limitations apply)

### **Desktop (Chrome/Edge)**:
1. "Install" button appears in address bar when PWA is detected
2. Or: Menu → Install Smart Fashion Styling
3. Creates window without browser UI

### **Windows with Edge/Chrome**:
1. 3-dot menu → Apps → Install...
2. Creates Start menu entry
3. Appears in Windows Settings → Apps & features

---

## 🔐 HTTPS Requirement

⚠️ **Important**: Service workers only work over HTTPS (or localhost for development).

For production deployment:
1. Get SSL certificate (Let's Encrypt is free)
2. Deploy backend on HTTPS
3. Deploy frontend on HTTPS
4. PWA features will be fully available

---

## 🛠️ Next Steps

1. **Add Icons**: Generate and place icon files in `public/icons/`
2. **Test Locally**: Run `npm run build` then `serve dist`
3. **Update Meta Tags** (optional): Edit manifest.json with your own metadata
4. **Initialize Backend**: Add HTTPS configuration for production
5. **Deploy**: Deploy to HTTPS hosting (Vercel, Netlify, AWS, Azure, etc.)

---

## 📚 Additional Resources

- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Vite PWA Plugin Docs](https://vite-plugin-pwa.netlify.app/)
- [Maskable Icons](https://maskable.app/)
- [Real Favicon Generator](https://realfavicongenerator.net/)

---

## ✨ Your PWA is Ready!

Your Smart Fashion Styling app is now a fully-functional Progressive Web App with:
- ✅ Offline functionality
- ✅ Installation capability
- ✅ Smart caching
- ✅ Notification support
- ✅ Background sync ready

Just add your icons and deploy to HTTPS to unleash the full PWA potential! 🚀
