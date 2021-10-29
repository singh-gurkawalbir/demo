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
  deisgn: {
    url: 'https://www.figma.com/file/xdzlBzxEc9OgsH9unzMsKr/List-view-for-%22Integrations%22-(Home)-page---IO-20667-%2F-DES-668?node-id=659%3A8687',
  },
};

export const withTwelveImages = Template.bind({});

withTwelveImages.args = {
  applications: ['3dcart', 'docusign', 'salesforce', 'magento', 'oracle', '4castplus', 'amazonmws', 'accelo', 'asana', 'http', 'surveymonkey', 'rest'],
};
withTwelveImages.parameters = {
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

