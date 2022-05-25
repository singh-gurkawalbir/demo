import Template from './Template';
import { Canvas } from '../../../views/FlowBuilder/FlowBuilderBody';
import withRouter from '../../components/globalSearch/withRouter';
import schemas from './exampleSchemas';

export default {
  title: 'Lab/Flow Builder Branching 2',
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

EmptyFlow.args = { resourceData: schemas.emptyFlow };
