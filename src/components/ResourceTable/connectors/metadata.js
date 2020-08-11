import React from 'react';
import Link from '@material-ui/core/Link';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import getImageUrl from '../../../utils/image';
import Delete from '../commonActions/Delete';
import TogglePublish from '../commonActions/TogglePublish';
import Edit from '../commonActions/Edit';
import InstallBase from './actions/InstallBase';
import Licenses from './actions/Licenses';
import CeligoTimeAgo from '../../CeligoTimeAgo';

export default {
  columns: [
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
      heading: 'Image',
      value(r) {
        return r.imageURL ? (
          <img src={getImageUrl(r.imageURL)} alt="Loading..." />
        ) : null;
      },
    },
    {
      heading: 'Website',
      value(r) {
        return r.websiteURL ? (
          <Link href={r.websiteURL} target="_blank">
            Website
          </Link>
        ) : null;
      },
    },
    {
      heading: 'Published',
      value: r => (r.published ? 'Yes' : 'No'),
    },
  ],
  rowActions: [Edit, InstallBase, Licenses, TogglePublish, Delete],
};
