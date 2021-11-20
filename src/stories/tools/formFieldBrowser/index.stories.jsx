import React from 'react';
import FormFieldBrowser from './FormFieldBrowser';

export default {
  title: 'Tools / Form Field Browser',
  component: FormFieldBrowser,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = () => (
  <FormFieldBrowser />
);

export const browseAllFieldDefinitions = Template.bind({});

