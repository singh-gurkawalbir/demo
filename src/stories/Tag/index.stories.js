import React from 'react';
import Tag from '../../components/HomePageCard/Footer/Tag';

export default {
  title: 'Components / Tag',
  component: Tag,
};

const Template = args => (
  <Tag {...args} />
);

export const Defaults = Template.bind({});

Defaults.args = {
  variant: 'Digital Pro',
};

export const homePageCardTag = Template.bind({});

homePageCardTag.args = {
  variant: 'Clone gainsight px which is the best integration',
};

