/* global describe, test, expect, jest, afterEach */
import React from 'react';
import { cloneDeep } from 'lodash';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import MappingSettingsButton from './SettingsButton';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';

async function initMappingSettingsButton({
  props = {},
  key = 'mapping_key',
  lookupName = 'lookup_name_1',
} = {}) {
  const initialStore = cloneDeep(reduxStore);

  initialStore.getState().session.mapping = {
    mapping: {
      importId: props.importId,
      flowId: props.flowId,
      mappings: [{
        generate: 'generate',
        key,
        lookupName,
      }],
      lookups: [
        {
          name: 'lookup_name_1',
          map: { 0: {} },
          allowFailures: true,
          useDefaultOnMultipleMatches: true,
          default: undefined,
        },
        {
          name: 'lookup_name_2',
          map: [{}],
          allowFailures: true,
          useDefaultOnMultipleMatches: true,
        },
      ],
    },
  };

  initialStore.getState().session.integrationApps.settings = {
    'flow_id-integration_id': {
      status: 'mappingStatus',
      mappings: {
        editor_id: {
          mappings: [{
            key,
            generate: 'generate_2',
            lookupName,
          }],
          lookups: [
            {
              name: 'lookup_name_1',
              allowFailures: true,
              useDefaultOnMultipleMatches: true,
              map: [],
            },
            {
              name: 'lookup_name_2',
              allowFailures: true,
              useDefaultOnMultipleMatches: true,
              map: [{}],
            },
          ],
        },
      },
      subRecordMappingId: props.subRecordMappingId,
    },
  };
  const ui = (
    <MemoryRouter>
      <MappingSettingsButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {
      pathname: '/',
    },
    push: mockHistoryPush,
  }),
}));

jest.mock('../../ActionButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../ActionButton'),
  default: props => (
    <>
      <button type="button" onClick={props.onClick} {...props}>
        Test Mock Button
      </button>
    </>
  ),
}));

describe('MappingSettingsButton test cases', () => {
  runServer();

  afterEach(() => {
    mockHistoryPush.mockClear();
  });

  test('should pass the intial render with default value', async () => {
    await initMappingSettingsButton();

    const buttonRef = screen.getByRole('button');

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);

    await expect(mockHistoryPush).toBeCalledTimes(0);
  });

  test('should pass the intial render to disable true', async () => {
    await initMappingSettingsButton({
      props: {
        isCategoryMapping: true,
        disabled: true,
      },
    });

    const buttonRef = screen.getByRole('button');

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);

    await expect(mockHistoryPush).toBeCalledTimes(0);
  });

  test('should pass the intial render to disable false', async () => {
    await initMappingSettingsButton({
      props: {
        isCategoryMapping: true,
        integrationId: 'integration_id',
        flowId: 'flow_id',
        editorId: 'editor_id',
        mappingKey: 'mapping_key',
      },
    });

    const buttonRef = screen.getByRole('button');

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);

    await expect(mockHistoryPush).toBeCalledTimes(1);
  });

  test('should pass the intial render to isCategoryMapping false', async () => {
    await initMappingSettingsButton({
      props: {
        mappingKey: 'mapping_key',
      },
    });

    const buttonRef = screen.getByRole('button');

    expect(buttonRef).toBeInTheDocument();
    userEvent.click(buttonRef);

    await expect(mockHistoryPush).toBeCalledTimes(1);
  });
});
