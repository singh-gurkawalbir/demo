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
      Value: ({rowData: r}) => <ApplicationImgCell applications={r.applications} />,

    },
    {
      heading: 'Name',
      width: '25%',
      Value: ({rowData: r}) => (
        <TextOverflowCell
          message={<ResourceDrawerLink resourceType="templates" resource={r} />} />
      ),
      orderBy: 'name',
    },
    {
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      heading: 'Website URL',
      Value: ({rowData: r}) => {
        // the hyperlink has to be an Absolute link to not open the link relative to our website domain
        const websiteURL = r.websiteURL?.startsWith('http') ? r.websiteURL : `https://${r.websiteURL}`;

        return (
          r.websiteURL && (
            <Link href={websiteURL} target="_blank" underline="none">
              View
            </Link>
          )
        );
      },
    },
    {
      heading: 'Published',
      Value: ({rowData: r}) => (
        <OnOffCell
          templateId={r._id}
          published={r.published}
          applications={r.applications}
          resourceType="templates"
          />

      ),
      orderBy: 'published',
    },
  ],
  rowActions: [Edit, UploadZipFile, Download, Delete],
};
