// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import GlobalSearchProto from './Prototype';
import Template from './Template';
import withRouter from './withRouter';

export default {
  title: 'Lab/GlobalSearch',
  decorators: [jsxDecorator, withRouter],

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
      { lastModified: '2021-02-18T21:29:37Z', name: 'Move data from point A to B', description: 'Description of a flow.' },
      { lastModified: '2021-02-18T21:29:37Z', name: 'This flow has no description' },
    ],
    imports: [
      { lastModified: '2021-08-10T21:29:37Z', name: 'Import 1', description: 'Description of the 1st import.', application: 'http' },
    ],
    exports: [
      { lastModified: '2019-12-18T21:29:37Z', name: 'Export 1', description: 'Description of the 1st Export.', application: 'http' },
    ],
    connections: [
      { lastModified: '2019-09-09T14:29:37Z', name: 'Starwars API', description: 'public API that exposes access to a database of the the Starwars universe.', application: 'http', isOnline: true },
      { lastModified: '2019-09-09T14:29:37Z', name: 'Shopify -EU stores', application: 'http', isOnline: false },
    ],
  },
};
