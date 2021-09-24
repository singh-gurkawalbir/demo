import React from 'react';
import DashboardTag from '../../../components/tags/DashboardTag';

export default {
  title: 'Components / Tags / DashboardTag',
  component: DashboardTag,
};

const Template = args => (
  <DashboardTag {...args} />
);

export const ErrorWithPartialResolved = Template.bind({});

ErrorWithPartialResolved.args = {
  label: 'Error',
  color: 'error',
  errorCount: 20,
  resolvedCount: 40,
};
export const SuccessWithPartialResolved = Template.bind({});

SuccessWithPartialResolved.args = {
  label: 'Completed',
  color: 'success',
  resolvedCount: 40,
};
export const WarningWithPartialError = Template.bind({});

WarningWithPartialError.args = {
  label: 'Warning',
  color: 'warning',
  errorCount: 40,
};

