import React from 'react';
import Link from '@material-ui/core/Link';
import Delete from '../commonActions/Delete';
import UploadZipFile from './actions/UploadZipFile';
import Download from '../commonActions/Download';
import Edit from '../commonActions/Edit';
import ApplicationImgCell from './cells/ApplicationImgCell';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import OnOffCell from './cells/OnOffCell';
import TextOverflowCell from '../../TextOverflowCell';

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
      width: '25%',
      value: function TemplatesDrawerLink(r) {
        return (
          <TextOverflowCell
            message={<ResourceDrawerLink resourceType="templates" resource={r} />} />
        );
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
        return (
          r.websiteURL && (
            <Link href={r.websiteURL} target="_blank" underline="none">
              View
            </Link>
          )
        );
      },
    },
    {
      heading: 'Published',
      value: function Type(r) {
        return (
          <OnOffCell
            templateId={r._id}
            published={r.published}
            applications={r.applications}
            resourceType="templates"
          />

        );
      },
      orderBy: 'published',
    },
  ],
  rowActions: [Edit, UploadZipFile, Download, Delete],
};
