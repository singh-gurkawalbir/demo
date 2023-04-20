
import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import metadata from './metadata';

describe('dynaChildLicenses metaData tests', () => {
  test('should pass the test case for each field', () => {
    const useColumns = metadata.useColumns();

    const date = useColumns.find(eachColumn => eachColumn.key === 'created');
    const timeStamp = date.Value({
      rowData: {created: '2018-06-06T00:00:00.000Z'},
    });

    expect(timeStamp).toEqual(<TimeAgo date="2018-06-06T00:00:00.000Z" />);

    let status = useColumns.find(eachColumn => eachColumn.key === 'status');
    let integrationStatus = status.Value({
      rowData: {_integrationId: '683091116265186'},
    });

    expect(integrationStatus).toBe('Installed');

    status = useColumns.find(eachColumn => eachColumn.key === 'status');
    integrationStatus = status.Value({
      rowData: {},
    });

    expect(integrationStatus).toBe('Pending');

    const id = useColumns.find(eachColumn => eachColumn.key === 'integrationId');

    const integrationId = id.Value({
      rowData: {_integrationId: '683091116265186'},
    });

    expect(integrationId).toBe('683091116265186');
  });
});
