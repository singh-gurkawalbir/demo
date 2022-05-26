import Template from './Template';
import { Canvas } from '../../../views/FlowBuilder/FlowBuilderBody';
import withRouter from '../../components/globalSearch/withRouter';
import schemas from './exampleSchemas';

export default {
  title: 'Lab/Flow Builder Branching',
  decorators: [withRouter],
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
};

export const EmptyFlow = Template.bind({});
export const ComplexFlow = Template.bind({});
export const MultipleSources = Template.bind({});
export const OverlappingEdges = Template.bind({});
export const SimpleTerminalEdges = Template.bind({});

EmptyFlow.args = { resourceData: schemas.emptyFlow };
ComplexFlow.args = { resourceData: schemas.complexFlow };
MultipleSources.args = { resourceData: schemas.multipleSources };
OverlappingEdges.args = { resourceData: schemas.overlappingEdges};
SimpleTerminalEdges.args = { resourceData: schemas.simpleTerminalEdges};
