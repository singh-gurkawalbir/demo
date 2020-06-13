import React from 'react';
import Link from '@material-ui/core/Link';
import Delete from '../../components/ResourceTable/actions/Delete';
import UploadZipFile from '../../components/ResourceTable/actions/UploadZipFile';
import Download from '../../components/ResourceTable/actions/Download';
import TogglePublish from '../../components/ResourceTable/actions/TogglePublish';
import { formatLastModified } from '../../components/CeligoTable/util';
import ResourceDrawerLink from '../../components/ResourceDrawerLink';

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
  rowActions: [UploadZipFile, Download, TogglePublish, Delete],
};
