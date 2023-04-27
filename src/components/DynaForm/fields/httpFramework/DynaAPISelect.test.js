import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import DynaAPISelect from './DynaAPISelect';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();
const resourceId = '_connectionId';
const resourceType = 'connections';
const props = {
  required: true,
  label: 'API type',
  id: 'http._httpConnectorApiId',
  formKey: 'connections-_connectionId',
  resourceType,
  resourceId,
  defaultValue: '',
};

function initDynaHFAssistantOptions(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.stage = {
      _connectionId: {
        patch: [
          {
            path: '/_httpConnectorId',
            op: 'add',
            value: {},
            timestamp: 1679146317867,
          },
          {
            op: 'replace',
            path: '/_httpConnectorId',
            value: 'connectorId1',
            timestamp: 1679146317867,
          },
          {
            path: '/application',
            op: 'add',
            value: {},
            timestamp: 1679146317867,
          },
          {
            op: 'replace',
            path: '/application',
            value: 'test_application',
            timestamp: 1679146317867,
          },
          {
            path: '/type',
            op: 'add',
            value: {},
            timestamp: 1679146317867,
          },
          {
            op: 'replace',
            path: '/type',
            value: 'http',
            timestamp: 1679146317867,
          },
        ],
      },
    };
    draft.data.httpConnectors.httpConnector = {
      connectorId1: {
        apis: [{
          _id: 'apiId1',
          name: 'API 1',
          description: 'This is API 1 description',
          versions: [{
            _id: 'versionId1',
            name: 'Version 1',
          }],
        }, {
          _id: 'apiId2',
          name: 'API 2',
          description: 'This is API 2 description',
          versions: [{
            _id: 'versionId2',
            name: 'Version 2',
          }],
        }],
      },
    };
    draft.session.form = {
      'connections-_connectionId': {
        fields: {
          '/http/_httpConnectorApiId': '',
        },
        value: {
          '/http/_httpConnectorApiId': '',
        },
      },
    };
  });
  renderWithProviders(<DynaAPISelect {...props} />, { initialStore });
}

describe('DynaAPISelect UI tests', () => {
  test('should pass the initial render', () => {
    initDynaHFAssistantOptions({ ...props });
    expect(screen.getByText(props.label)).toBeInTheDocument();
  });
  test('should be able to select the fields', async () => {
    initDynaHFAssistantOptions({ ...props });
    const boxRadio = screen.getAllByRole('radio')?.[0];

    expect(boxRadio).not.toBeChecked();
    await userEvent.click(boxRadio);
    expect(boxRadio).toBeChecked();
  });
});
