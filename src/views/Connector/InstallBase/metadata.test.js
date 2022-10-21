/* global describe, test, expect */

import React from 'react';
import metadata from './metadata';
import ExpiresOn from '../../../components/ResourceTable/commonCells/ExpiredOn';

describe('Installbase metadata test cases', () => {
  test('should pass the test case for each field', () => {
    const useColumns = metadata.useColumns();

    const name = useColumns.find(eachColumn => eachColumn.key === 'name');
    const nameValue = name.Value({
      rowData: {
        name: 'name',
      },
    });

    expect(nameValue).toBe('name');

    const email = useColumns.find(eachColumn => eachColumn.key === 'email');
    const emailValue = email.Value({
      rowData: {
        email: 'email',
      },
    });

    expect(emailValue).toBe('email');

    const integrationId = useColumns.find(eachColumn => eachColumn.key === 'integrationId');
    const integrationIdValue = integrationId.Value({
      rowData: {
        _integrationId: 'integration_id_1',
      },
    });

    expect(integrationIdValue).toEqual('integration_id_1');

    const expiresOn = useColumns.find(eachColumn => eachColumn.key === 'expiresOn');
    const expiresOnValue = expiresOn.Value({
      rowData: {
        license: {
          expires: 'expires',
        },
      },
    });

    expect(expiresOnValue).toEqual(<ExpiresOn date="expires" />);

    const environment = useColumns.find(eachColumn => eachColumn.key === 'environment');
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
    const version = useColumns.find(eachColumn => eachColumn.key === 'version');
    const versionValue = version.Value({
      rowData: {
        updateInProgress: true,
      },
    });

    expect(versionValue).toBe('In progress...');
    const version1Value = version.Value({
      rowData: {
        updateInProgress: false,
        version: '1.0.0',
      },
    });

    expect(version1Value).toBe('1.0.0');
  });
});
