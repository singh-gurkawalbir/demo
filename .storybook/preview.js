import React from 'react';
import { addDecorator } from '@storybook/react';
import { withMuiTheme } from "@harelpls/storybook-addon-materialui";
import themeProvider from '../src/theme/themeProvider';
import FontStager from '../src/components/FontStager';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [
// decorate every story with the mui theme provider.
withMuiTheme({
    'Default (light)': themeProvider('light'),
    'Sandbox': themeProvider('sandbox'),
  
  }),
  // inject the font stager to load custom fonts for each story.
  (Story) => (
    <>
      <FontStager/>
      <Story />
    </>
  ),
];