import React from 'react';
import { useSelector } from 'react-redux';
import GlobalSearch from '../../stories/lab/globalSearch/Prototype';
import LoadResources from '../../components/LoadResources';
import { selectors } from '../../reducers/data/resources';

const results = {
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
};
export default function GSearch() {
  const integrations = useSelector(state => selectors.resource(state, 'integration'));

  console.log({integrations});
  const resourcesToLoad = 'published,integrations,connections,marketplacetemplates,flows';

  return (
    <LoadResources required={false} resources={resourcesToLoad}>
      <GlobalSearch results={results} />
    </LoadResources>
  );
}
