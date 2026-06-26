export function register() {
  if ('serviceWorker' in navigator && (import.meta.env.PROD || true)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}
