import React from 'react';
import StatusTag from '../../../components/StatusTag';

export default {
  title: 'Components / Tags / StatusTag',
  component: StatusTag,
};

const Template = args => (
  <StatusTag {...args} />
);

export const Defaults = Template.bind({});

Defaults.args = {
  label: 'default',
};

export const Completed = Template.bind({});

Completed.args = {
  label: 'completed',
  variant: 'success',
};
export const Warning = Template.bind({});

Warning.args = {
  label: 'Warning',
  variant: 'warning',
};
export const Info = Template.bind({});

Info.args = {
  label: 'Info',
  variant: 'info',
};
export const Realtime = Template.bind({});

Realtime.args = {
  label: 'Realtime',
  variant: 'realtime',
};
export const ErrorWithPartialResolved = Template.bind({});

ErrorWithPartialResolved.args = {
  label: 'Error',
  variant: 'success',
  errorValue: 20,
  resolvedValue: 40,
};
export const SuccessWithPartialResolved = Template.bind({});

SuccessWithPartialResolved.args = {
  label: 'completed',
  variant: 'success',
  resolvedValue: 40,
};
export const WarningWithPartialError = Template.bind({});

WarningWithPartialError.args = {
  label: 'warning',
  variant: 'warning',
  errorValue: 40,
};

