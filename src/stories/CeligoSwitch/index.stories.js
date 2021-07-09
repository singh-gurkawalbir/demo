import React from 'react';
import CeligoSwitch from '../../components/CeligoSwitch';

export default {
  title: 'Components / CeligoSwitch',
  component: CeligoSwitch,
};

const Template = args => <CeligoSwitch {...args} />;

const onChangeHandler = () => {
  // eslint-disable-next-line
  console.log("I'm checked");
};
export const defaults = Template.bind({});

export const checked = Template.bind({});

checked.args = {
  checked: true,
};
export const unChecked = Template.bind({});

unChecked.args = {
  checked: false,
};

export const onChange = Template.bind({});

onChange.args = {
  onChange: onChangeHandler,
};

