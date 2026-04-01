import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import './i18n';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles.css';

const theme = createTheme({
  primaryColor: 'terracotta',
  defaultRadius: 'lg',
  fontFamily: '"Manrope", "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"Sora", "Manrope", sans-serif',
    fontWeight: '700',
  },
  colors: {
    terracotta: [
      '#fdf4ef',
      '#f9e5d9',
      '#f2c7ad',
      '#e9a683',
      '#de825d',
      '#cf6d45',
      '#b75e3a',
      '#9b4f31',
      '#7d3f27',
      '#622f1d',
    ],
    forest: [
      '#edf3ef',
      '#d7e6dc',
      '#b1ccb9',
      '#8cb295',
      '#679873',
      '#4f7e5c',
      '#3f674b',
      '#31503a',
      '#233c2c',
      '#17271d',
    ],
    sun: [
      '#fff9e8',
      '#fff1c9',
      '#fbe49a',
      '#f5d66a',
      '#efc948',
      '#e5b62f',
      '#c9971e',
      '#9f7515',
      '#75540d',
      '#4c3507',
    ],
    dune: [
      '#fffaf1',
      '#f9efdf',
      '#f1dcc0',
      '#e8c89f',
      '#dfb47d',
      '#d59e61',
      '#b47f49',
      '#8d6238',
      '#664629',
      '#422c18',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Card: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" />
      <App />
    </MantineProvider>
  </StrictMode>,
);
