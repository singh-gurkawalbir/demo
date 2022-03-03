import Proto from './Prototype';
import Template from './Template';
import withRouter from '../globalSearch/withRouter';

export default {
  title: 'Lab/Flow builder react-flow new Schema',
  decorators: [withRouter],
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
