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

const Template = ({primaryButtonText, secondaryButtonText, ...args}) => (
  <>
    <AppBar />
    <PageBar />
    <EmptyState {...args}>
      <FilledButton>{primaryButtonText}</FilledButton>
      {secondaryButtonText && <TextButton underline>{secondaryButtonText}</TextButton>}
    </EmptyState>
  </>
);

export const Default = Template.bind({});

Default.parameters = designParameters;

Default.args = {
  title: 'Welcome',
  subTitle: 'Welcome to the new connections experience',
  type: 'connections',
  altText: 'Connections image alt text',
  primaryButtonText: 'Create Flow',
  secondaryButtonText: 'Secondary text link with underline treatment',
};

export const LongTitleText = Template.bind({});

LongTitleText.parameters = designParameters;

LongTitleText.args = {
  title: `Welcome to the new connections experience. 
          This is a really long "Title" to demonstrate if and how it will wrap to a second line.`,
  subTitle: 'Welcome to the new connections experience',
  type: 'connections',
  altText: 'Connections image alt text',
  primaryButtonText: 'Create Flow',
  secondaryButtonText: 'Secondary text link with underline treatment',
};

export const LongSubTitleText = Template.bind({});

LongSubTitleText.parameters = designParameters;

LongSubTitleText.args = {
  title: 'Welcome',
  subTitle: `Welcome to the new connections experience. 
             This is a really long subTitle to demonstrate if and how it will wrap to a second line. 
             It should also help identify line height issues.`,
  type: 'connections',
  altText: 'Connections image alt text',
  primaryButtonText: 'Create Flow',
  secondaryButtonText: 'Secondary text link with underline treatment',
};

export const NoSubTitle = Template.bind({});

NoSubTitle.parameters = designParameters;

NoSubTitle.args = {
  title: 'Welcome',
  type: 'connections',
  altText: 'Connections image alt text',
  primaryButtonText: 'Create Flow',
  secondaryButtonText: 'Secondary text link with underline treatment',
};

export const SingleButton = Template.bind({});

SingleButton.parameters = designParameters;

SingleButton.args = {
  title: 'Welcome',
  subTitle: 'Welcome to the new connections experience',
  type: 'connections',
  altText: 'Connections image alt text',
  primaryButtonText: 'Create Flow',
};
