import React from 'react';
import LoginScreen from '../../../components/LoginScreen';

const urls = {
  contentUrlProd: 'https://www.celigo.com/login/display',
  contentUrlStag: `${process.env.IO_LOGIN_PROMOTION_URL}`,
  contentUrlProdEU: 'https://www.celigo.com/login/display-eu',
  contentUrlStagEU: 'https://staging.celigo.com/login/display-eu',
  foregroundImageUrl: 'https://www.celigo.com/wp-content/uploads/g2-medal-winter-2021.svg',
  backgroundImageUrl: 'https://www.celigo.com/wp-content/uploads/home-hero.svg',
  targetUrl: 'https://docs.celigo.com/hc/en-us/community/topics',
};

export default {
  title: 'Lab/ Marketing Login',
  component: LoginScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = args => <LoginScreen {...args} />;

export const withIframeStag = Template.bind({});

withIframeStag.args = {
  contentUrl: urls.contentUrlStag,
};

export const withIframeProd = Template.bind({});

withIframeProd.args = {
  contentUrl: urls.contentUrlProd,
};
export const withIframeStagEU = Template.bind({});

withIframeStagEU.args = {
  contentUrl: urls.contentUrlStagEU,
};
export const withIframe = Template.bind({});

withIframe.args = {
  contentUrl: urls.contentUrlProdEU,
};
export const fallBackIframe = Template.bind({});

fallBackIframe.args = {
  contentUrl: '',
};

export const withImages = Template.bind({});

withImages.args = {
  backgroundImageUrl: urls.backgroundImageUrl,
  foregroundImageUrl: urls.foregroundImageUrl,
  targetUrl: urls.targetUrl,
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
