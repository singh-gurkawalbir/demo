/* global describe, test, expect */
import React from 'react';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import metadata from './metadata';

describe('DynaChildLicenses metaData tests', () => {
  test('should pass the test case for each field', () => {
    const useColumns = metadata.useColumns();

    const date = useColumns.find(eachColumn => eachColumn.key === 'created');
    const timeStamp = date.Value({
      rowData: {created: '2018-06-06T00:00:00.000Z'},
    });

    expect(timeStamp).toEqual(<CeligoTimeAgo date="2018-06-06T00:00:00.000Z" />);

    let status = useColumns.find(eachColumn => eachColumn.key === 'status');
    let integrationStatus = status.Value({
      rowData: {_integrationId: '683091116265186'},
    });

    expect(integrationStatus).toEqual('Installed');

    status = useColumns.find(eachColumn => eachColumn.key === 'status');
    integrationStatus = status.Value({
      rowData: {},
    });

    expect(integrationStatus).toEqual('Pending');

    const id = useColumns.find(eachColumn => eachColumn.key === 'integrationId');

    const integrationId = id.Value({
      rowData: {_integrationId: '683091116265186'},
    });

    expect(integrationId).toEqual('683091116265186');
  });
});
