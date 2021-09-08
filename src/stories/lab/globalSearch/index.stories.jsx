// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import GlobalSearchProto from './Prototype';
import Template from './Template';

export default {
  title: 'Lab/GlobalSearch',
  decorators: [jsxDecorator],
  component: GlobalSearchProto,
};

const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://www.figma.com/file/bR1oxaXGiYMrbHGub1vsrL/Global-search---IO-13368-%2F-DES-683?node-id=0%3A1',
  },
};

export const Example = Template.bind({});

Example.parameters = designParameters;
Example.args = {
  results: {
    flows: [
      { name: 'Flow A', description: 'Description of a flow.' },
    ],
    imports: [
      { name: 'Import 1', description: 'Description of the 1st import.', application: 'http' },
    ],
    exports: [
      { name: 'Export 1', description: 'Description of the 1st Export.', application: 'http' },
    ],
  },
};
