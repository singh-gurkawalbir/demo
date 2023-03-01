
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { mutateStore, reduxStore, renderWithProviders } from '../../../../test/test-utils';
import metadata from '../metadata';
import CeligoTable from '../../../CeligoTable';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources.flows = [
    {
      _id: '6366bee72c1bd1023108c05b',
      lastModified: '2022-05-28T05:45:51.473Z',
      name: 'New flow',
      disabled: true,
      _integrationId: '62662cc4e06ff462c3db470e',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          _importId: '62677c50563089236fed72a1',
          type: 'import',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62677c18563089236fed7295',
          skipRetries: false,
        },
      ],
      createdAt: '2022-04-26T04:59:05.445Z',
      lastExecutedAt: '2022-04-26T05:03:02.115Z',
      autoResolveMatchingTraceKeys: true,
    },
  ];
  draft.data.resources.integrations = [{
    _id: '62662cc4e06ff462c3db470e',
    lastModified: '2022-04-29T12:23:16.887Z',
    name: 'Production',
    _templateId: '5d9eb2c7224c6042d7a2fc98',
    description: 'demo integration',
    install: [],
    sandbox: false,
    _registeredConnectionIds: [
      '62677b90737f015ed4aff4e8',
      '626a251fb940193d088f3e72',
    ],
    installSteps: [],
    uninstallSteps: [],
    flowGroupings: [],
    createdAt: '2022-04-25T05:08:20.172Z',
  }];
});

function initImports(data = []) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={data} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}
describe('test suite for oldValue', () => {
  const testDate = new Date('2018-12-24T10:33:30.000+05:30');

  test('should render the table and display the old value of auditlog', () => {
    const data = [{
      time: testDate,
      byUser: {
        name: 'auditlogs',
        email: 'auditlogtest@celigo.com',
      },
      source: 'UI',
      _resourceId: '6366bee72c1bd1023108c05b',
      resourceType: 'flow',
      event: 'Update',
      fieldChange: {
        fieldPath: 'pageProcessors',
        oldValue: '2022-11-06T20:34:51.426Z',
        newValue: '2022-11-07T20:20:23.020Z',
      },
      _id: 'auditlogs',
    }];

    initImports(data);
    expect(screen.getByText('2022-11-06T20:34:51.426Z')).toBeInTheDocument();
  });
  test('should display dialog box after clicking on click to view button', async () => {
    const data = [{
      time: testDate,
      byUser: {
        name: 'CeligoTest',
        email: 'auditlogtest@celigo.com',
      },
      source: 'UI',
      _resourceId: '6366bee72c1bd1023108c05b',
      resourceType: 'flow',
      event: 'Update',
      resourceName: 'New flow',
      fieldChange: {
        fieldPath: 'pageProcessors',
        oldValue: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '6321ff7a0643cf0e259ffb86',
          },
        ],
      },
      _id: 'auditlogs',
    }];

    initImports(data);
    const clickToViewButton = screen.getByText('View');

    expect(clickToViewButton).toBeInTheDocument();

    await userEvent.click(clickToViewButton);
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
  });
});
