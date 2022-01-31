import React from 'react';
import EmptyState from '.';

export default {
  title: 'Lab/ Empty State',
  component: EmptyState,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = args => <EmptyState {...args} />;

export const homePage = Template.bind({});

// homePage.args = {
//   children: 'Connections page',
// };
const designParameters = {
  design: {
    type: 'figma',
    allowFullScreen: true,
    url: 'https://www.figma.com/file/xheN2TIbsGLKAsM9magqbj/Improve-empty-states-for-first-time-IO-user-experience%3A-DES-830?node-id=0%3A1',
  },
};

homePage.parameters = designParameters;
