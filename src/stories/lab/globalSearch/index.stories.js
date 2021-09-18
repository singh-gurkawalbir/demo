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
      { name: 'Some template', description: 'This is newest version of Salesforce - NetSuite Integration App built on Celigos integrator.io platform. Streamline your Lead-to-Cash process and manage sales process effectively and in real-time. Packed with Celigos deep domain expertise and best practices, this Integration App is the embodiment of several years of customer feedback, learning and growth. With distributed adapters running in NetSuite and Salesforce, our integration app allows endless customization options.' },
      { name: 'Another template'},
    ],
  },
};

export const EmptyResults = Template.bind({});

EmptyResults.parameters = designParameters;
EmptyResults.args = {
  results: {},
};

export const ResourceOnlyResults = Template.bind({});

ResourceOnlyResults.parameters = designParameters;
ResourceOnlyResults.args = {
  results: {
    connections: [
      { lastModified: '2019-09-09T14:29:37Z', name: 'Walmart API', isOnline: true },
      { lastModified: '2019-09-09T14:29:37Z', name: 'Starwars API', description: 'public API that exposes access to a database of the the Starwars universe.', isOnline: true },
      { lastModified: '2019-09-09T14:29:37Z', name: 'Shopify -EU stores', isOnline: false },
    ],
  },
};

export const MarketplaceOnlyResults = Template.bind({});

MarketplaceOnlyResults.parameters = designParameters;
MarketplaceOnlyResults.args = {
  results: {
    marketplaceTemplates: [
      { name: 'Some template', description: 'This is newest version of Salesforce - NetSuite Integration App built on Celigos integrator.io platform. Streamline your Lead-to-Cash process and manage sales process effectively and in real-time. Packed with Celigos deep domain expertise and best practices, this Integration App is the embodiment of several years of customer feedback, learning and growth. With distributed adapters running in NetSuite and Salesforce, our integration app allows endless customization options.' },
      { name: 'Another template'},
    ],
    marketplaceConnectors: [
      { name: 'Some Integration app', description: 'This is newest version of Salesforce - NetSuite Integration App built on Celigos integrator.io platform. Streamline your Lead-to-Cash process and manage sales process effectively and in real-time. Packed with Celigos deep domain expertise and best practices, this Integration App is the embodiment of several years of customer feedback, learning and growth. With distributed adapters running in NetSuite and Salesforce, our integration app allows endless customization options.' },
      { name: 'Another marketplace integration app with a long title.'},
    ],
  },
};
