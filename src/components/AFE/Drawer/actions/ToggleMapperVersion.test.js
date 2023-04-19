import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleMapperVersion from './ToggleMapperVersion';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initToggleMapperVersion(props = {}) {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        mappings: [
          {
            extract: 'Company',
            generate: 'organization.name',
            dataType: 'string',
            key: 'Ueyz5rCd9',
          },
        ],
        lookups: [],
        v2TreeData: [
          {
            key: 'kM5GnZYZhyNtcdhSXLA3j',
            isEmptyRow: true,
            title: '',
            disabled: false,
            dataType: 'string',
            sourceDataType: 'string',
          },
        ],
        expandedKeys: [
          'kM5GnZYZhyNtcdhSXLA3j',
        ],
        flowId: '63a54e63d9e20c15d94da0f1',
        importId: '632950280dbc53086e899759',
        status: 'received',
        isGroupedSampleData: false,
        isMonitorLevelAccess: false,
        version: 1,
      }};
    draft.data.resources = {
      imports: [
        {
          _id: '632950280dbc53086e899759',
          createdAt: '2022-09-20T05:31:20.542Z',
          lastModified: '2022-09-20T05:31:20.618Z',
          name: 'Test ZD Import',
          _connectionId: '62fb430f5fb285335fc1bed6',
          apiIdentifier: 'i40d0edd33',
          ignoreExisting: false,
          ignoreMissing: false,
          oneToMany: false,
          mapping: {
            fields: [
              {
                extract: 'Company',
                generate: 'organization.name',
                dataType: 'string',
              },
            ],
          },
          http: {
            relativeURI: [
              '/organizations',
            ],
            method: [
              'POST',
            ],
            body: [
              '{\n    "organization": {\n      "name": "{{timestamp format "Asia/Calcutta"}} {{record.organization.name}}"\n    }\n}',
            ],
            headers: [
              {
                name: 'mediaType',
                value: '{{connection.http.mediaType}}',
              },
            ],
            batchSize: 1,
            sendPostMappedData: true,
            formType: 'http',
          },
          filter: {
            type: 'expression',
            expression: {
              rules: [],
              version: '1',
            },
            version: '1',
            rules: [],
          },
          adaptorType: 'HTTPImport',
        },
      ],
    };
    draft.session.editors = {
      'mappings-632950280dbc53086e899759': {
        editorType: 'mappings',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '632950280dbc53086e899759',
        resourceType: 'imports',
        stage: 'importMappingExtract',
        data: 'somedata',
        fieldId: '',
        layout: 'compact2',
        autoEvaluate: false,
        sampleDataStatus: 'received',
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<ToggleMapperVersion {...props} />, {initialStore});
}

describe('ToggleMapperVersion UI tests', () => {
  test('Should test the initial render where mapper version is initially set to mapper 1.0', () => {
    initToggleMapperVersion({editorId: 'mappings-632950280dbc53086e899759'});
    const mapper1dotOButton = screen.getByRole('button', {name: 'Mapper 1.0'});

    expect(mapper1dotOButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('Should make a dispatch call when toggle map version is set to Mapper 2.0', async () => {
    initToggleMapperVersion({editorId: 'mappings-632950280dbc53086e899759'});
    const mapper2dotOButton = screen.getByRole('button', {name: 'Mapper 2.0'});

    expect(mapper2dotOButton).toBeInTheDocument();
    await userEvent.click(mapper2dotOButton);
    expect(mockDispatch).toHaveBeenCalledWith(actions.mapping.toggleVersion(2));
    const mapper1dotOButton = screen.getByRole('button', {name: 'Mapper 1.0'});

    expect(mapper1dotOButton).toBeInTheDocument();
  });
  test('Should display help text when clicked on Help text button', async () => {
    initToggleMapperVersion({editorId: 'mappings-632950280dbc53086e899759'});
    const helpTextButton = screen.getAllByRole('button');

    expect(helpTextButton[2]).toBeInTheDocument();
    await userEvent.click(helpTextButton[2]);
    const tooltip = screen.getByRole('tooltip');

    expect(tooltip).toBeInTheDocument();
  });
});
