import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import LogoStrip from '../../../components/LogoStrip';

export default {
  title: 'Lab / LogoStrip',
  component: LogoStrip,
  decorators: [withDesign, jsxDecorator],
};
const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-Integrations-Home-page-IO-20667-DES-668?node-id=659%3A8687',
  },
};
const Template = args => <LogoStrip {...args} />;

export const withFourImages = Template.bind({});

withFourImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento'],
};
withFourImages.parameters = designParameters;

export const withEightImages = Template.bind({});

withEightImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo'],
};
withEightImages.parameters = designParameters;

export const withTwelveImages = Template.bind({});

withTwelveImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest'],
};
withTwelveImages.parameters = designParameters;

export const withSixTeenImages = Template.bind({});

withSixTeenImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};
withSixTeenImages.parameters = designParameters;

