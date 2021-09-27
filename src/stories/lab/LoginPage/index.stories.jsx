import Template from './Template';

const contentUrl = 'https://staging.celigo.com/login/display';
const foregroundImageUrl = 'https://www.celigo.com/wp-content/uploads/g2-medal-winter-2021.svg';
const backgroundImageUrl = 'https://www.celigo.com/wp-content/uploads/home-hero.svg';
const targetUrl = 'https://docs.celigo.com/hc/en-us/community/topics';

export default {
  title: 'Lab/ Marketing Login',
};

export const withIframe = Template.bind({});

withIframe.args = {
  contentUrl,
};

export const withImages = Template.bind({});

withImages.args = {
  backgroundImageUrl,
  foregroundImageUrl,
  targetUrl,
};

