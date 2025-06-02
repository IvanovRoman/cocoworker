import { useState, useEffect } from 'react';

const useInitTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<typeof Telegram.WebApp | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Checking if WebApp is initialized...");
      if (Telegram?.WebApp) {
        setWebApp(Telegram.WebApp);
        Telegram.WebApp.expand();
        Telegram.WebApp.ready();
        clearInterval(timer);
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return webApp;
};

export default useInitTelegramWebApp;