import React from 'react';
import IntegrationTag from '../../../components/tags/IntegrationTag';

export default {
  title: 'Components / Tags / IntegrationTag',
  component: IntegrationTag,
};

const Template = args => (
  <IntegrationTag {...args} />
);

export const ShortLabel = Template.bind({});

ShortLabel.args = {
  label: 'New',
};

export const LongLabel = Template.bind({});

LongLabel.args = {
  label: 'Clone gainsight px which is the best integration',
};

