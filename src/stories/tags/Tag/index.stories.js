import React from 'react';
import Tag from '../../../components/tags/Tag';

export default {
  title: 'Components / Tags / Tag',
  component: Tag,
};

const Template = args => (
  <Tag {...args} />
);

export const Defaults = Template.bind({});

Defaults.args = {
  label: 'default',
};

export const Completed = Template.bind({});

Completed.args = {
  label: 'Success',
  color: 'success',
};
export const Warning = Template.bind({});

Warning.args = {
  label: 'Warning',
  color: 'warning',
};
export const Info = Template.bind({});

Info.args = {
  label: 'Info',
  color: 'info',
};

export const Error = Template.bind({});

Error.args = {
  label: 'Error',
  color: 'error',
};
