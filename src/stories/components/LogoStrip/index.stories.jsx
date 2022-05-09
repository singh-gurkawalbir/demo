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
  parameters: {
    design: {
      type: 'figma',
      allowFullscreen: true,
      url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=0%3A1',
    },
  },
};
const Template = args => <LogoStrip {...args} />;

export const withFourImages = Template.bind({});

withFourImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento'],
};

export const withEightImages = Template.bind({});

withEightImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo'],
};

export const withTenImages = Template.bind({});

withTenImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'redshift', 'dynamodb'],
};
withTenImages.parameters = {
  design: {
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=659%3A8687',
  },
};

export const withElevenImages = Template.bind({});

withElevenImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey'],
};
withElevenImages.parameters = {
  design: {
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=1102%3A4020',
  },
};
export const withSixTeenImages = Template.bind({});

withSixTeenImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};

withSixTeenImages.parameters = {
  design: {
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=1102%3A4020',
  },
};

export const withMax = Template.bind({});

withMax.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb', '3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb', '3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};

withMax.parameters = {
  design: {
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=1117%3A4318',
  },
};

export const custom1x5 = Template.bind({});

custom1x5.args = {
  size: 'medium',
  rows: 1,
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};

export const custom2x6 = Template.bind({});

custom2x6.args = {
  size: 'medium',
  columns: 6,
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};

export const custom3x2 = Template.bind({});

custom3x2.args = {
  size: 'medium',
  rows: 3,
  columns: 2,
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest', 'redshift', 'dynamodb', 'bigquery', 'mongodb'],
};
