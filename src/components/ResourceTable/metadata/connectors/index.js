import React from 'react';
import Link from '@material-ui/core/Link';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import Delete from '../../actions/Delete';
import TogglePublish from '../../actions/TogglePublish';
import InstallBase from '../../actions/Connectors/InstallBase';
import Licenses from '../../actions/Connectors/Licenses';
import { formatLastModified } from '../../../CeligoTable/util';
import getImageUrl from '../../../../utils/image';
import Edit from '../../actions/Edit';

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
      value: r => formatLastModified(r.lastModified),
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
