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

export default {
  columns: [
    {
      heading: 'Applications',
      value: function Applications(r) {
        return <ApplicationImgCell applications={r.applications} />;
      },

    },
    {
      heading: 'Name',
      value: function ConnectorsDrawerLink(r) {
        return <ResourceDrawerLink resourceType="connectors" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      heading: 'Website URL',
      value(r) {
        return r.websiteURL ? (
          <Link href={r.websiteURL} target="_blank">
            View
          </Link>
        ) : null;
      },
    },
    {
      heading: 'Published',
      value: function Type(r) {
        return (
          <OnOffCell
            connectorId={r._id}
            published={r.published}
            applications={r.applications}
            resourceType="connectors"
          />
        );
      },
    },
  ],
  rowActions: [Edit, InstallBase, Licenses, Delete],
};
