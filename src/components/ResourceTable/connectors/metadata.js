import React from 'react';
import Link from '@material-ui/core/Link';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import Delete from '../commonActions/Delete';
import Edit from '../commonActions/Edit';
import InstallBase from './actions/InstallBase';
import Licenses from './actions/Licenses';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import OnOffCell from './cells/OnOffCell';
import ApplicationImgCell from './cells/ApplicationImgCell';
import TextOverflowCell from '../../TextOverflowCell';

export default {
  useColumns: () => [
    {
      key: 'applications',
      heading: 'Applications',
      Value: ({rowData: r}) => <ApplicationImgCell applications={r.applications} />,
    },
    {
      key: 'name',
      heading: 'Name',
      width: '25%',
      Value: ({rowData: r}) => <TextOverflowCell message={<ResourceDrawerLink resourceType="connectors" resource={r} />} />,
      orderBy: 'name',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      key: 'websiteUrl',
      heading: 'Website URL',
      Value: ({rowData: r}) => {
        // the hyperlink has to be an Absolute link to not open the link relative to our website domain
        const websiteURL = r.websiteURL?.startsWith('http') ? r.websiteURL : `https://${r.websiteURL}`;

        return r.websiteURL ? (
          <Link href={websiteURL} target="_blank" underline="none">
            View
          </Link>
        ) : null;
      },
    },
    {
      key: 'published',
      heading: 'Published',
      Value: ({rowData: r}) => (
        <OnOffCell
          connectorId={r._id}
          published={r.published}
          applications={r.applications}
          resourceType="connectors"
          />
      ),
      orderBy: 'published',
    },
  ],
  useRowActions: () => [Edit, InstallBase, Licenses, Delete],
};
