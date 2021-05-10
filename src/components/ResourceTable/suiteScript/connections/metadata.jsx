import React from 'react';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import ResourceDrawerLink from '../../../SuiteScript/ResourceDrawerLink';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: resource}) => {
        const tableContext = useGetTableContext();

        return (
          <ResourceDrawerLink
            ssLinkedConnectionId={tableContext.ssLinkedConnectionId}
            resourceType="connections"
            resource={resource}
        />
        );
      },
      orderBy: 'name',
    },
    {
      key: 'type',
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
      key: 'api',
      heading: 'API',
      Value: ({rowData: resource}) =>
        (resource[resource.type === 'sftp' ? 'ftp' : resource.type].hostURI),
    },
    {
      key: 'username',
      heading: 'Username',
      Value: ({rowData: resource}) =>
        (resource[resource.type === 'sftp' ? 'ftp' : resource.type].username),
    },
  ],
};
