import React from 'react';
import StatusCircle from '../../components/StatusCircle';

export default {
  title: 'components / StatusCircle',
  component: StatusCircle,
};

const Template = args => (
  <StatusCircle {...args} />
);

export const Defaults = Template.bind({});

Defaults.args = {
  variant: 'default',
};
export const Success = Template.bind({});

Success.args = {
  variant: 'success',
};
export const Warning = Template.bind({});

Warning.args = {
  variant: 'warning',
};
export const Info = Template.bind({});

Info.args = {
  variant: 'info',
};
export const SmallSize = Template.bind({});

SmallSize.args = {
  variant: 'success',
  size: 'small',
};
export const StatusCircleWithText = Template.bind({});

StatusCircleWithText.args = {
  variant: 'success',
  size: 'small',
};
