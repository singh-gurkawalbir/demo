import Proto from './Prototype';
import Template from './Template';
import withRouter from '../../components/globalSearch/withRouter';
import metadata from './exampleSchemas';

export default {
  title: 'Lab/Flow Builder Branching',
  decorators: [withRouter],
  component: Proto,
  parameters: {
    layout: 'fullscreen',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
};

const {emptyFlow, complexFlow, multipleSources} = metadata;

export const EmptyFlow = Template.bind({});
export const ComplexFlow = Template.bind({});
export const MultipleSources = Template.bind({});

EmptyFlow.args = { resourceState: emptyFlow };
ComplexFlow.args = { resourceState: complexFlow };
MultipleSources.args = { resourceState: multipleSources };
