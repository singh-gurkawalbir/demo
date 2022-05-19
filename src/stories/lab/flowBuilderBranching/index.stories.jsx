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

const {emptyFlow, complexFlow, multipleSources, overlappingEdges, simpleTerminalEdges} = metadata;

export const EmptyFlow = Template.bind({});
export const ComplexFlow = Template.bind({});
export const MultipleSources = Template.bind({});
export const OverlappingEdges = Template.bind({});
export const SimpleTerminalEdges = Template.bind({});

EmptyFlow.args = { resourceState: emptyFlow };
ComplexFlow.args = { resourceState: complexFlow };
MultipleSources.args = { resourceState: multipleSources };
OverlappingEdges.args = { resourceState: overlappingEdges};
SimpleTerminalEdges.args = { resourceState: simpleTerminalEdges};
