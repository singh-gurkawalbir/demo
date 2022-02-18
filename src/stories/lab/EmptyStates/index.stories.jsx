import React from 'react';
import EmptyState from '.';
import {FilledButton, TextButton} from '../../../components/Buttons';
import AppBar from '../../mocks/AppBar';
import PageBar from '../../mocks/PageBar';

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

export const myIntegrations = () => (
  <EmptyState type="integrations" title="Jumpstart your data integration" subTitle="You can access, manage, and monitor flows from within integrations on this page.">
    <FilledButton>Create Flow</FilledButton>
    <TextButton underline>Learn how to develop integrations in flow builder</TextButton>
  </EmptyState>
);

myIntegrations.parameters = designParameters;

const Template = args => (
  <>
    <AppBar />
    <PageBar />
    <EmptyState {...args}>
      <FilledButton>Create Flow</FilledButton>
      <TextButton underline>Test link</TextButton>
    </EmptyState>
  </>
);

export const Connections = Template.bind({});

Connections.args = {
  title: 'Welcome',
  subTitle: 'WElcome to the new connections experience',
  type: 'agents',
};
