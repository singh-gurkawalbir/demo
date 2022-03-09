/* eslint-disable no-console */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import SubNavMenuItem from './index';

export default {
  title: 'Lab / SubNav Menu Item',
  component: SubNavMenuItem,
};

const handleMouseEnter = action('Mouse Entered');
const handleMouseLeave = action('Mouse Leave');

const Template = args => <SubNavMenuItem {...args} />;

export const NameWithStatus = Template.bind();
export const NameWithGrippper = Template.bind();
export const NameWithErrors = Template.bind();
export const NameWithMaxErrors = Template.bind();
export const NameWithoutStatusAndGrippper = Template.bind();

NameWithStatus.args = {
  name: 'It is a very long name',
  isGripperVisible: true,
};
NameWithGrippper.args = {
  name: 'Provisioning',
  isGripperVisible: true,
  onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
};
NameWithErrors.args = {
  name: 'Deprovisioning',
  isGripperVisible: true,
  errorCount: 1000,
};
NameWithMaxErrors.args = {
  name: 'Deprovisioning',
  isGripperVisible: true,
  errorCount: 10000,
};
NameWithoutStatusAndGrippper.args = {
  name: 'Deprovisioning',
};
