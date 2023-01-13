
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import metadata from '../metadata';
import CeligoTable from '../../../CeligoTable';

function initImports(data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui);
}
describe('test suite for NewValue', () => {
  const testDate = new Date('2018-12-24T10:33:30.000+05:30');

  test('should display newValue after rendering celigo table', () => {
    const data = [{
      time: testDate,
      byUser: {
        name: 'auditlogs',
        email: 'auditlogtest@celigo.com',
      },
      source: 'UI',
      _resourceId: '6366bee72c1bd1023108c05b',
      resourceType: 'connection',
      event: 'Update',
      fieldChange: {
        fieldPath: 'pageProcessors',
        oldValue: '2022-11-06T20:34:51.426Z',
        newValue: '2022-11-07T20:20:23.020Z',
      },
      _id: 'auditlogs',
    }];

    initImports(data);
    expect(screen.getByText('2022-11-07T20:20:23.020Z')).toBeInTheDocument();
  });

  test('should display click to view after rendering old value data', () => {
    const data = [{
      time: testDate,
      byUser: {
        name: 'auditlogs',
        email: 'auditlogtest@celigo.com',
      },
      source: 'UI',
      _resourceId: '6366bee72c1bd1023108c05b',
      resourceType: 'connection',
      event: 'Update',
      fieldChange: {
        fieldPath: 'pageProcessors',
        oldValue: {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '634592daced7de038e18b6aa',
        },
      },
      _id: 'auditlogs',
    }];

    initImports(data);
    expect(screen.getByText('Click to view')).toBeInTheDocument();
  });
});
