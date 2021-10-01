import React from 'react';
import LogoStrip from '../../../components/LogoStrip';

export const Template = args => <LogoStrip {...args} />;

export default {
  title: 'Lab/LogoStrip',
  component: LogoStrip,
};

export const withFour = Template.bind({});

withFour.args = {
  count: 4,
};

