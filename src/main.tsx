import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui';
import App from './App.tsx';
import { UpdatedProvider } from './shared/context.tsx';

import '@vkontakte/vkui/dist/vkui.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <AdaptivityProvider>
        <UpdatedProvider>
          <App />
        </UpdatedProvider>
      </AdaptivityProvider>
    </ConfigProvider>
  </StrictMode>,
)
