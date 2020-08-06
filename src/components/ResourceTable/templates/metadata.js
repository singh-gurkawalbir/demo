import React from 'react';
import Link from '@material-ui/core/Link';
import Delete from '../commonActions/Delete';
import UploadZipFile from './actions/UploadZipFile';
import Download from '../commonActions/Download';
import TogglePublish from '../commonActions/TogglePublish';
import Edit from '../commonActions/Edit';
import { formatLastModified } from '../../CeligoTable/util';
import ResourceDrawerLink from '../../ResourceDrawerLink';

export default {
  columns: [
    {
      heading: 'Name',
      value: function TemplatesDrawerLink(r) {
        return <ResourceDrawerLink resourceType="templates" resource={r} />;
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
        return <img src={r.imageURL} alt="" />;
      },
    },
    {
      heading: 'Website',
      value(r) {
        return (
          r.websiteURL && (
            <Link href={r.websiteURL} target="_blank">
              Website
            </Link>
          )
        );
      },
    },
    {
      heading: 'Published',
      value: r => (r.published ? 'Yes' : 'No'),
    },
  ],
  rowActions: [Edit, TogglePublish, UploadZipFile, Download, Delete],
};
