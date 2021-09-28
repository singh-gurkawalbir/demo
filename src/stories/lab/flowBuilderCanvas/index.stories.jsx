import Proto from './Prototype';
import Template from './Template';

export default {
  title: 'Lab/Flow builder canvas',
  component: Proto,
};

export const Example = Template.bind({});

Example.parameters = {
  layout: 'fullscreen',
  previewTabs: {
    'storybook/docs/panel': {
      hidden: true,
    },
  },
};
