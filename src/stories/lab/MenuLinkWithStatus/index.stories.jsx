/* eslint-disable no-console */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import MenuLinkWithStaus from './index';
import Status from '../../../components/Buttons/Status';

export default {
  title: 'Lab / MenuLinkWithStatus',
  component: MenuLinkWithStaus,
};

const handleMouseEnter = action('Mouse Entered');
const handleMouseLeave = action('Mouse Leave');

const Template = args => <MenuLinkWithStaus {...args} />;

export const NameWithStatus = Template.bind();
export const NameWithoutStatus = Template.bind();
export const NameWithStatusAndGrippper = Template.bind();
export const NameWithoutStatusAndGrippper = Template.bind();

NameWithStatus.args = {
  name: 'It is a very long name',
  status: <Status variant="success" />,
};
NameWithoutStatus.args = {
  name: 'Welcometotheworld',
  isGripperVisible: true,
};
NameWithStatusAndGrippper.args = {
  name: 'welcometotheworld',
  isGripperVisible: true,
  status: <Status variant="success" />,
  onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
};
NameWithoutStatusAndGrippper.args = {
  name: 'welcometotheworld',
};
