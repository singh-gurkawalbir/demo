import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import themeProvider from '../src/theme/themeProvider';
import FontStager from '../src/components/FontStager';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Change theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      // array of plain string values or "MenuItem shape" (see storybook docs)
      items: ['light', 'sandbox', 'dark (not supported)'],
    },
  },
};

const withThemeProvider = (Story, context) => {
  const theme = themeProvider(context.globals.theme);

  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  )
}

export const decorators = [
  // this decorator forces stories to re-render any time the
  // global storybook context changes. This happens when a 
  // user changes the global theme value in the Storybook toolbar.
  withThemeProvider,

  // Inject the font stager to lazy-load custom fonts 
  // for each story just like our UI does.
  (Story) => (
    <>
      <FontStager/>
      <Story />
    </>
  ),
];