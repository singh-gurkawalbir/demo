import React from 'react';
import Link from '@mui/material/Link';
import Delete from '../commonActions/Delete';
import UploadZipFile from './actions/UploadZipFile';
import Download from '../commonActions/Download';
import Edit from '../commonActions/Edit';
import LogoStrip from '../../LogoStrip';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import OnOffCell from './cells/OnOffCell';
import TextOverflowCell from '../../TextOverflowCell';

export default {

  useColumns: () => [
    {
      key: 'applications',
      heading: 'Applications',
      isLoggable: true,
      Value: ({rowData: r}) => <LogoStrip rows={1} columns={4} applications={r.applications} size="medium" />,
    },
    {
      key: 'name',
      heading: 'Name',
      width: '25%',
      isLoggable: true,
      Value: ({rowData: r}) => (
        <TextOverflowCell
          message={<ResourceDrawerLink resourceType="templates" resource={r} />} />
      ),
      orderBy: 'name',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      key: 'websiteUrl',
      heading: 'Website URL',
      // is it always link text...should be loggable...new tab will be outside the ambit of logrocket
      isLoggable: true,
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
      key: 'published',
      heading: 'Published',
      isLoggable: true,
      align: 'center',
      Value: ({rowData: r}) => (
        <OnOffCell
          templateId={r._id}
          published={r.published}
          applications={r.applications}
          resourceType="templates"
          tooltip="Unpublish / Publish"
          />

      ),
      orderBy: 'published',
    },
  ],
  useRowActions: () => [Edit, UploadZipFile, Download, Delete],
};
