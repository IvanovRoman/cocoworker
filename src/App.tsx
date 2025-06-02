import { useCallback, useEffect, useState } from 'react';
import { AppRoot } from '@vkontakte/vkui';
import { Main } from './dashboard';

import useInitTelegramWebApp from './hooks/useInitTelegramWebApp';
import { useUpdatedContext } from './shared/context';
import { addUser } from './shared/firebase';
import type { TelegramWebApps } from 'telegram-webapps';

function App() {
  const [loading, setLoading] = useState(true);

  const { setOwnerId } = useUpdatedContext();
  const webApp = useInitTelegramWebApp();

  const getUser = useCallback(() => {
    let user: TelegramWebApps.WebAppUser | undefined = undefined;

    if (import.meta.env.DEV) {
      user = {
        'id': 772091100,
        'first_name': 'User1',
        'last_name': '',
        'username': 'User_1',
        'language_code': 'eng',
        'allows_write_to_pm': true,
        'photo_url': ''
      };
    } else if (webApp) {
      user = webApp.initDataUnsafe.user;
    }

    return user;
  }, [webApp]);

  useEffect(() => {
    const user = getUser();
    if (user) {
      addUser({ name: user.first_name, id: user.id });
      setOwnerId(user.id);
      setLoading(false);
    }
  }, [webApp, setOwnerId, getUser]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AppRoot>
      <Main />
    </AppRoot>
  )
}

export default App
