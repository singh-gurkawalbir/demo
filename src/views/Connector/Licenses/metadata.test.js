/* global describe, test, expect */

import React from 'react';
import metadata from './metadata';
import ResourceDrawerLink from '../../../components/ResourceDrawerLink';
import CeligoTimeAgo from '../../../components/CeligoTimeAgo';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';
import Delete from '../../../components/ResourceTable/commonActions/Delete';
import Edit from '../../../components/ResourceTable/commonActions/Edit';

describe('Licenses metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const useColumns = metadata.useColumns();

    const email = useColumns.find(eachColumn => eachColumn.key === 'email');
    const emailValue = email.Value({
      rowData: {},
    });

    expect(emailValue).toEqual(<ResourceDrawerLink resourceType="connectorLicenses" resource={{}} />);

    const status = useColumns.find(eachColumn => eachColumn.key === 'status');
    const statusValue = status.Value({
      rowData: {},
    });

    expect(statusValue).toEqual('Pending install');
    const status1Value = status.Value({
      rowData: {
        _integrationId: 'id_1',
      },
    });

    expect(status1Value).toEqual('Installed');

    const created = useColumns.find(eachColumn => eachColumn.key === 'created');
    const createdValue = created.Value({
      rowData: {
        created: '',
      },
    });

    expect(createdValue).toEqual(<CeligoTimeAgo date="" />);

    const integrationId = useColumns.find(eachColumn => eachColumn.key === 'integrationId');
    const integrationIdValue = integrationId.Value({
      rowData: {
        _integrationId: 'integration_id_1',
      },
    });

    expect(integrationIdValue).toEqual('integration_id_1');

    const expires = useColumns.find(eachColumn => eachColumn.key === 'expires');
    const expiresValue = expires.Value({
      rowData: {
        expires: 'expires',
      },
    });

    expect(expiresValue).toEqual(<ExpiresOn date="expires" />);

    const trialExpires = useColumns.find(eachColumn => eachColumn.key === 'trialExpires');
    const trialExpiresValue = trialExpires.Value({
      rowData: {
        trialEndDate: 'trialEndDate',
      },
    });

    expect(trialExpiresValue).toEqual(<ExpiresOn date="trialEndDate" />);

    const environment = useColumns.find(eachColumn => eachColumn.key === 'environment');
    const environmentValue = environment.Value({
      rowData: {
        type: 'integrationAppChild',
      },
    });

    expect(environmentValue).toBeNull();

    const environment1Value = environment.Value({
      rowData: {
        sandbox: true,
      },
    });

    expect(environment1Value).toBe('Sandbox');

    const environment2Value = environment.Value({
      rowData: {
        sandbox: false,
      },
    });

    expect(environment2Value).toBe('Production');

    const useRowActions = metadata.useRowActions();

    expect(useRowActions).toEqual([Edit, Delete]);
  });
});
