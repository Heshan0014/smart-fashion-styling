/**
 * PWA Features Demo Component
 * Shows how to use PWA utilities in your React app
 * 
 * This is an example component - you can integrate these features
 * into your existing components or create a dedicated PWA settings page
 */

import React, { useState, useEffect } from 'react';
import {
  isAppInstalled,
  isOffline,
  showInstallPrompt,
  setupInstallPrompt,
  setupOfflineListener,
  requestNotificationPermission,
  sendNotification,
  getCacheInfo,
  getServiceWorkerStatus,
  clearAllCaches,
  subscribeToPushNotifications,
  requestPeriodicSync,
  requestBackgroundSync
} from '../pwa/utils';

export function PWADemo() {
  const [canInstall, setCanInstall] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(isOffline());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);
  const [swStatus, setSwStatus] = useState(null);
  const [appInstalled, setAppInstalled] = useState(isAppInstalled());

  // Setup PWA listeners on mount
  useEffect(() => {
    // Setup install prompt
    setupInstallPrompt(() => {
      setCanInstall(true);
      console.log('Install prompt is ready!');
    });

    // Setup online/offline listeners
    setupOfflineListener(
      () => {
        console.log('App went offline');
        setIsOfflineMode(true);
      },
      () => {
        console.log('App is back online');
        setIsOfflineMode(false);
      }
    );

    // Check notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    // Get service worker status
    getServiceWorkerStatus().then(status => {
      setSwStatus(status);
      console.log('Service Worker Status:', status);
    });

    // Listen for app install
    window.addEventListener('appinstalled', () => {
      console.log('App was installed!');
      setAppInstalled(true);
      setCanInstall(false);
    });

    return () => {
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  // Handle install button click
  const handleInstall = async () => {
    const success = await showInstallPrompt();
    if (success) {
      console.log('User installed the app!');
      setCanInstall(false);
    }
  };

  // Handle notification permission
  const handleNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      console.log('Notifications enabled!');
    }
  };

  // Send test notification
  const handleSendNotification = async () => {
    const success = await sendNotification('🎉 PWA Works!', {
      body: 'Your Progressive Web App notifications are working!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'pwa-notification',
      requireInteraction: true
    });

    if (success) {
      console.log('Notification sent!');
    }
  };

  // View cache information
  const handleViewCache = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
    console.log('Cache Info:', info);
  };

  // Clear all caches
  const handleClearCache = async () => {
    const success = await clearAllCaches();
    if (success) {
      console.log('Caches cleared!');
      setCacheInfo(null);
    }
  };

  // Request periodic sync (e.g., sync recommendations every 24 hours)
  const handlePeriodicSync = async () => {
    const success = await requestPeriodicSync('sync-recommendations', 24 * 60 * 60 * 1000);
    if (success) {
      console.log('Periodic sync enabled!');
    }
  };

  // Request background sync (e.g., when user sends a message offline)
  const handleBackgroundSync = async () => {
    const success = await requestBackgroundSync('sync-profile-updates');
    if (success) {
      console.log('Background sync enabled!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0DB] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Progressive Web App Features</h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* App Installation Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📱 Installation Status</h2>
            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-semibold">App Installed:</span>{' '}
                {appInstalled ? (
                  <span className="text-green-600 font-bold">Yes ✓</span>
                ) : (
                  <span className="text-orange-600 font-bold">No</span>
                )}
              </p>
              {canInstall && !appInstalled && (
                <button
                  onClick={handleInstall}
                  className="w-full px-4 py-2 bg-[#7a5a34] text-white rounded font-semibold hover:bg-[#6a4a24] transition"
                >
                  📥 Install App
                </button>
              )}
              {appInstalled && (
                <p className="text-green-600 text-sm font-semibold">✓ App is installed and ready to use!</p>
              )}
            </div>
          </div>

          {/* Offline Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🌐 Connection Status</h2>
            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-semibold">Status:</span>{' '}
                {isOfflineMode ? (
                  <span className="text-red-600 font-bold">⚠️ Offline</span>
                ) : (
                  <span className="text-green-600 font-bold">✓ Online</span>
                )}
              </p>
              {isOfflineMode && (
                <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  You can still use the app with cached data!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Service Worker Status */}
        {swStatus && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Service Worker Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold">Status:</span> {swStatus.status}
              </p>
              {swStatus.scopeURL && (
                <p>
                  <span className="font-semibold">Scope:</span> {swStatus.scopeURL}
                </p>
              )}
              {swStatus.active && (
                <p>
                  <span className="font-semibold">Active:</span> {swStatus.active}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Notifications</h2>
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-semibold">Notifications:</span>{' '}
              {notificationsEnabled ? (
                <span className="text-green-600 font-bold">✓ Enabled</span>
              ) : (
                <span className="text-orange-600 font-bold">Not enabled</span>
              )}
            </p>
            <div className="flex gap-2">
              {!notificationsEnabled && (
                <button
                  onClick={handleNotifications}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Enable Notifications
                </button>
              )}
              {notificationsEnabled && (
                <button
                  onClick={handleSendNotification}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Send Test Notification
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Background Sync */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔄 Background Sync</h2>
          <p className="text-sm text-gray-600 mb-4">
            Enable background sync so profile updates are sent even if the app is closed.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleBackgroundSync}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Enable Background Sync
            </button>
            <button
              onClick={handlePeriodicSync}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Enable Periodic Sync (24h)
            </button>
          </div>
        </div>

        {/* Cache Management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💾 Cache Management</h2>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleViewCache}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                View Cache Info
              </button>
              <button
                onClick={handleClearCache}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Clear All Caches
              </button>
            </div>

            {cacheInfo && (
              <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200">
                <h3 className="font-bold mb-2">Cache Details:</h3>
                <pre className="text-xs overflow-auto max-h-64">
                  {JSON.stringify(cacheInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Development Info */}
        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">ℹ️ Development Info</h2>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>• Service Worker is active and caching content automatically</li>
            <li>• Check DevTools → Application → Service Workers to manage the service worker</li>
            <li>• Go to DevTools → Application → Cache Storage to view cached files</li>
            <li>• Check "Offline" in DevTools to test offline functionality</li>
            <li>• In Chrome, the install prompt appears after using the app for 30+ seconds</li>
            <li>• PWA features require HTTPS in production (localhost OK for development)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PWADemo;
