import React from 'react';
import NotificationToaster from '../../components/NotificationToaster';

export default {
  title: 'Components/NotificationToaster',
  component: NotificationToaster,
};

const Template = args => (
  <NotificationToaster {...args} />
);

export const Warning = Template.bind({});

Warning.args = {
  variant: 'warning',
  children: 'This is a warning message!',
};
export const Error = Template.bind({});

Error.args = {
  variant: 'error',
  children: 'This is an error message!',
};
export const Success = Template.bind({});

Success.args = {
  variant: 'success',
  children: 'This is a success message!',
};
export const Info = Template.bind({});

Info.args = {
  variant: 'info',
  children: 'This is an info message!',
};

export const InfoLarge = Template.bind({});

InfoLarge.args = {
  variant: 'info',
  children: 'A good user experience is when we give the proper message to the user in a detailed!',
  size: 'large',
};
export const WarningMedium = Template.bind({});

WarningMedium.args = {
  variant: 'warning',
  children: 'A good user experience is when we give the detailed message!',
  size: 'medium',
};
