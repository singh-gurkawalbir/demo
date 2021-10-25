import React from 'react';
import CeligoSwitch from '../../components/CeligoSwitch';

export default {
  title: 'Components / CeligoSwitch',
  component: CeligoSwitch,
};

const Template = args => <CeligoSwitch {...args} />;

export const defaults = Template.bind({});

export const checked = Template.bind({});

checked.args = {
  checked: true,
};
export const unChecked = Template.bind({});

unChecked.args = {
  checked: false,
};
