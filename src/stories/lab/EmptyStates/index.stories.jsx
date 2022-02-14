import React from 'react';
import EmptyState from '.';

export default {
  title: 'Lab/ Empty State',
  component: EmptyState,
  parameters: {
    layout: 'fullscreen',
  },
};

const designParameters = {
  design: {
    type: 'figma',
    allowFullScreen: true,
    url: 'https://www.figma.com/file/xheN2TIbsGLKAsM9magqbj/Improve-empty-states-for-first-time-IO-user-experience%3A-DES-830?node-id=0%3A1',
  },
};

const Template = args => <EmptyState {...args} />;

export const myIntegrations = Template.bind({});

myIntegrations.parameters = designParameters;

myIntegrations.args = {
  children: 'Connections page',
};

