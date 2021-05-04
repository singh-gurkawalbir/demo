import React from 'react';
import ResourceDrawerLink from '../../../SuiteScript/ResourceDrawerLink';

export default {
  columns: (r, actionProps) => [
    {
      heading: 'Name',
      Value: ({rowData: resource}) => (
        <ResourceDrawerLink
          ssLinkedConnectionId={actionProps.ssLinkedConnectionId}
          resourceType="connections"
          resource={resource}
        />
      ),
      orderBy: 'name',
    },
    {
      heading: 'Type',
      Value: ({rowData: resource}) => ({
        ebay: 'eBay',
        ftp: 'FTP',
        sftp: 'SFTP',
        magento: 'Magento',
        newegg: 'Newegg',
        netsuite: 'NetSuite',
        ofxserver: 'OFX Server',
        other: 'Other',
        rakuten: 'Rakuten',
        salesforce: 'Salesforce',
        sears: 'Sears',
      }[resource.type] || resource.type),
    },
    {
      heading: 'API',
      Value: ({rowData: resource}) =>
        (resource[resource.type === 'sftp' ? 'ftp' : resource.type].hostURI),
    },
    {
      heading: 'Username',
      Value: ({rowData: resource}) =>
        (resource[resource.type === 'sftp' ? 'ftp' : resource.type].username),
    },
  ],
};
