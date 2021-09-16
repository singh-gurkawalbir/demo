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

export const FullResults = Template.bind({});

FullResults.parameters = designParameters;
FullResults.args = {
  results: {
    flows: [
      { lastModified: '2021-02-18T21:29:37Z', name: 'Move data from point A to B', description: 'Description of a flow.' },
      { lastModified: '2021-02-18T21:29:37Z', name: 'This flow has no description' },
    ],
    integrations: [
      { lastModified: '2021-08-10T21:29:37Z', name: 'Integration 1', description: 'Description of the 1st Integration.' },
    ],
    scripts: [
      { lastModified: '2019-12-18T21:29:37Z', name: 'Script 1', description: 'Description of the 1st Script.' },
      { lastModified: '2019-12-18T21:29:37Z', name: 'Script 2', description: 'Description of the 2nd Script.' },
    ],
    connections: [
      { lastModified: '2019-09-09T14:29:37Z', name: 'Walmart API', isOnline: true },
      { lastModified: '2019-09-09T14:29:37Z', name: 'Starwars API', description: 'public API that exposes access to a database of the the Starwars universe.', isOnline: true },
      { lastModified: '2019-09-09T14:29:37Z', name: 'Shopify -EU stores', isOnline: false },
    ],
    recycleBin: [
      { lastModified: '2019-12-18T21:29:37Z', name: 'Some deleted Import', resourceType: 'Import', description: 'Description of the 1st Script.' },
      { lastModified: '2019-12-18T21:29:37Z', name: 'Some deleted Export', resourceType: 'Export' },
    ],
    marketplaceTemplates: [
      { lastModified: '2019-12-18T21:29:37Z', name: 'Some template', description: 'Description of the 1st Export.' },
      { lastModified: '2019-12-18T21:29:37Z', name: 'Another template'},
    ],
  },
};

export const EmptyResults = Template.bind({});

EmptyResults.parameters = designParameters;
EmptyResults.args = {
  results: {},
};
