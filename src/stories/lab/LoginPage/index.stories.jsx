import React from 'react';
// import Template from './Template';
import LoginScreen from '../../../components/LoginScreen';

const contentUrl = 'https://staging.celigo.com/login/display';
const foregroundImageUrl = 'https://www.celigo.com/wp-content/uploads/g2-medal-winter-2021.svg';
const backgroundImageUrl = 'https://www.celigo.com/wp-content/uploads/home-hero.svg';
const targetUrl = 'https://docs.celigo.com/hc/en-us/community/topics';

export default {
  title: 'Lab/ Marketing Login',
  component: LoginScreen,
};

const Template = args => <LoginScreen {...args} />;

export const withIframe = Template.bind({});

withIframe.args = {
  contentUrl,
};
export const fallBackIframe = Template.bind({});

fallBackIframe.args = {
  contentUrl: '',
};

export const withImages = Template.bind({});

withImages.args = {
  backgroundImageUrl,
  foregroundImageUrl,
  targetUrl,
};

export const frontMediumImage = Template.bind({});

frontMediumImage.args = {
  ...withImages.args,
  size: 'medium',
};

export const frontRightImage = Template.bind({});

frontRightImage.args = {
  ...withImages.args,
  direction: 'right',
};

export const frontCenterImage = Template.bind({});

frontCenterImage.args = {
  ...withImages.args,
  direction: 'center',
};

export const fallBackImages = Template.bind({});

fallBackImages.args = {
  backgroundImageUrl: '',
  foregroundImageUrl: '',
  targetUrl: '',
};
