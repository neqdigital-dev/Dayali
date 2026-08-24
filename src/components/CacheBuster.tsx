import { useEffect } from 'react';

const CURRENT_VERSION = '1.0.1'; // Change this to force a cache clear on all clients

export default function CacheBuster() {
  useEffect(() => {
    const storedVersion = localStorage.getItem('dayali-app-version');
    
    if (storedVersion !== CURRENT_VERSION) {
      console.log('New version detected! Clearing caches and unregistering Service Workers...');
      
      // Update the version in storage
      localStorage.setItem('dayali-app-version', CURRENT_VERSION);

      // Unregister all service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          let hasUnregistered = false;
          const unregisterPromises = registrations.map(registration => {
            hasUnregistered = true;
            return registration.unregister();
          });
          
          Promise.all(unregisterPromises).then(() => {
            // Clear CacheStorage (PWA caches)
            if ('caches' in window) {
              caches.keys().then((names) => {
                Promise.all(names.map(name => caches.delete(name))).then(() => {
                  // Reload the page to fetch fresh assets
                  if (hasUnregistered) {
                    window.location.reload();
                  }
                });
              });
            } else if (hasUnregistered) {
               window.location.reload();
            }
          });
        });
      }
    }
  }, []);

  return null;
}
