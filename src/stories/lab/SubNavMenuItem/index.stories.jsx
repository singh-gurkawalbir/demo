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
export const NameWithoutStatus = Template.bind();
export const NameWithStatusAndGrippper = Template.bind();
export const NameWithoutStatusAndGrippper = Template.bind();

NameWithStatus.args = {
  name: 'It is a very long name',
};
NameWithoutStatus.args = {
  name: 'Welcometotheworld',
  isGripperVisible: true,
  errorCount: 10000,

};
NameWithStatusAndGrippper.args = {
  name: 'welcometotheworld',
  isGripperVisible: true,
  onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
};
NameWithoutStatusAndGrippper.args = {
  name: 'welcometotheworld',
};
