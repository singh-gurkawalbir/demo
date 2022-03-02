import React from 'react';
import MenuLinkWithStaus from './index';

export default {
  title: 'Lab / MenuLinkWithStatus',
  component: MenuLinkWithStaus,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = args => <MenuLinkWithStaus {...args} />;

export const onlyNameWithStatus = Template.bind();

onlyNameWithStatus.args = {
  name: 'IT is a very long name',
  isGripperVisible: true,
};
