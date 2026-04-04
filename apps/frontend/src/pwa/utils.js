/**
 * PWA Utility Helper
 * Provides functions for PWA features like install prompt, offline detection, etc.
 */

let deferredPrompt;

// Detect if the app is installed
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Detect if the app is offline
export function isOnline() {
  return navigator.onLine;
}

// Detect if the app is online
export function isOffline() {
  return !navigator.onLine;
}

// Get the install prompt
export function getInstallPrompt() {
  return deferredPrompt;
}

// Show the install prompt
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.warn('Install prompt not available');
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
}

// Clear the install prompt
export function clearInstallPrompt() {
  deferredPrompt = null;
}

// Setup install prompt listener
export function setupInstallPrompt(onPromptReady) {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    console.log('Install prompt is ready');
    if (onPromptReady) {
      onPromptReady();
    }
  });
}

// Setup offline listener
export function setupOfflineListener(onOffline, onOnline) {
  window.addEventListener('offline', () => {
    console.log('[PWA] App went offline');
    if (onOffline) onOffline();
  });

  window.addEventListener('online', () => {
    console.log('[PWA] App came online');
    if (onOnline) onOnline();
  });
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Notifications are not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Send a notification
export async function sendNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('Notifications not available or not permitted');
    return false;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'notify',
        title,
        options
      });
    } else {
      new Notification(title, options);
    }
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

// Register for push notifications
export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.REACT_APP_PUSH_PUBLIC_KEY
    });
    console.log('Push notification subscription successful:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

// Request periodic sync
export async function requestPeriodicSync(tag, minInterval = 24 * 60 * 60 * 1000) {
  if (!('serviceWorker' in navigator) || !('periodicSync' in ServiceWorkerRegistration.prototype)) {
    console.log('Periodic sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.periodicSync.register(tag, { minInterval });
    console.log(`Periodic sync registered for: ${tag}`);
    return true;
  } catch (error) {
    console.error(`Error registering periodic sync (${tag}):`, error);
    return false;
  }
}

// Request background sync
export async function requestBackgroundSync(tag) {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    console.log('Background sync not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register(tag);
    console.log(`Background sync registered for: ${tag}`);
    return true;
  } catch (error) {
    console.error(`Error registering background sync (${tag}):`, error);
    return false;
  }
}

// Get cache info
export async function getCacheInfo() {
  if (!('caches' in window)) {
    return null;
  }

  try {
    const cacheNames = await caches.keys();
    const cacheInfo = {};

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      cacheInfo[name] = {
        size: keys.length,
        entries: keys.map(req => req.url)
      };
    }

    return cacheInfo;
  } catch (error) {
    console.error('Error getting cache info:', error);
    return null;
  }
}

// Clear all caches
export async function clearAllCaches() {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
}

// Get service worker status
export async function getServiceWorkerStatus() {
  if (!('serviceWorker' in navigator)) {
    return { status: 'not-supported' };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      return { status: 'not-registered' };
    }

    return {
      status: 'registered',
      scopeURL: registration.scope,
      updateViaCache: registration.updateViaCache,
      installing: registration.installing ? 'yes' : 'no',
      waiting: registration.waiting ? 'yes' : 'no',
      active: registration.active ? 'yes' : 'no'
    };
  } catch (error) {
    console.error('Error getting service worker status:', error);
    return { status: 'error', error: error.message };
  }
}

console.log('[PWA] Utility helper loaded');
