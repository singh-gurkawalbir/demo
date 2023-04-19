import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import SettingsDrawer from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import customCloneDeep from '../../../utils/customCloneDeep';

async function initSettingsDrawer({
  props = {
    integrationId: 'integration_id',
    flowId: 'flow_id',
    importId: 'import_id',
  },
  url,
  adaptorType = 'HTTPImport',
  params,
  key = 'mapping_key',
  value = {
    fieldMappingType: 'lookup',
    _mode: 'static',
    _mapList: [],
  },
  lookupName = 'lookup_name_1',
} = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.integrationApps.settings = {
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
    draft.session.form = {
      mappingSettings: {
        isValid: true,
        value,
      },
    };
    draft.session.mapping = {
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
    draft.data.resources = {
      imports: [{
        _id: props.importId,
        _connectionId: 'connection_id_1',
        adaptorType,
        mappings: {
          fields: [{
            generate: 'generate_1',
          }, {
            generate: 'generate_2',
            lookupName: 'lookup_name',
          }],
          lists: [{
            generate: 'item',
            fields: [],
          }],
        },
        http: {
          requestMediaType: 'xml',
        },
      }],
    };
  });

  // settings/category/:editorId/sections/:sectionId/:depth/:mappingKey
  // settings/v2/:nodeKey/:generate
  // settings/:mappingKey
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/integrations/integration_id/flowBuilder/flow_id/mappings/${url}`}]}
    >
      <Route
        path="/integrations/integration_id/flowBuilder/flow_id/mappings"
        params={params}
        >
        <SettingsDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

const mockCloseAfterSave = jest.fn().mockReturnValue({
  closeAfterSave: true,
});

jest.mock('../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm'),
  default: props => {
    const handleSave = () => {
      const { closeAfterSave } = mockCloseAfterSave();

      props.onSave(closeAfterSave);
    };

    return (
      <>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={props.onClose}>
          Mock Close
        </button>
      </>

    );
  },

}));

const mockHistorygoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => <>Redirected to {to}</>),
  useHistory: () => ({
    goBack: mockHistorygoBack,
  }),
}));

jest.mock('../../AFE/Editor/panels/Mappings/Mapper2/Settings', () => ({
  __esModule: true,
  ...jest.requireActual('../../AFE/Editor/panels/Mappings/Mapper2/Settings'),
  default: () => (
    <>
      V2 SETTINGS render
    </>
  ),
}));

describe('settingsDrawer test cases', () => {
  runServer();

  afterEach(() => {
    mockHistorygoBack.mockClear();
  });

  describe('settingsDrawer component CATEGORY MAPPING SETTINGS Test cases', () => {
    const url = 'settings/category/editor_id/sections/section_id/depth/mapping_key';

    const params = {
      editorId: 'editor_id',
      sectionId: 'section_id',
      depth: 'depth',
      mappingKey: 'mapping_key',
    };

    test('should pass the initial render to redirect', async () => {
      await initSettingsDrawer({
        url: 'settings/category/editor_id/sections/section_id/depth/mapping_key',
        params,
        key: 'mapping_key1',
      });

      expect(screen.queryByText('Redirected to /integrations/integration_id/flowBuilder/flow_id/mappings')).toBeInTheDocument();
      expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
    });

    test('should pass the initial render with empty map static lookup', async () => {
      await initSettingsDrawer({
        url,
        params,
      });

      expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
      expect(screen.queryByText(/Save/i)).toBeInTheDocument();
      expect(screen.queryByText(/Close/i)).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', {name: /Save/i}));

      await expect(screen.findByText(/You need to map at least one value./i)).resolves.toBeInTheDocument();
      expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
    });

    test('should pass the initial render with static lookup map', async () => {
      await initSettingsDrawer({
        url,
        params,
        lookupName: 'lookup_name_2',
      });

      expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
      expect(screen.queryByText(/Save/i)).toBeInTheDocument();
      expect(screen.queryByText(/Close/i)).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', {name: /Save/i}));

      expect(screen.queryByText(/You need to map at least one value./i)).not.toBeInTheDocument();
      expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
    });

    test('should pass the initial render with static lookup map with closeAfterSave false', async () => {
      mockCloseAfterSave.mockReturnValue({
        closeAfterSave: false,
      });
      await initSettingsDrawer({
        url,
        params,
        lookupName: 'lookup_name_2',
      });

      expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
      expect(screen.queryByText(/Save/i)).toBeInTheDocument();
      expect(screen.queryByText(/Close/i)).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', {name: /Save/i}));

      expect(screen.queryByText(/You need to map at least one value./i)).not.toBeInTheDocument();
      expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
    });
  });

  describe('settingsDrawer component V2 SETTINGS Test cases', () => {
    const url = 'settings/v2/node_key/generate';

    const params = {
      nodeKey: 'node_key',
      generate: 'generate',
    };

    test('should pass the initial render with default values', async () => {
      await initSettingsDrawer({
        url,
        params,
      });

      expect(screen.queryByText('V2 SETTINGS render')).toBeInTheDocument();
    });
  });

  describe('settingsDrawer component SETTINGS Test cases', () => {
    const url = 'settings/mapping_key';

    const params = {
      mappingKey: 'mapping_key',
    };

    test('should pass the initial render with default values', async () => {
      await initSettingsDrawer({
        url,
        params,
        key: 'mapping_key1',
      });

      expect(screen.queryByText('Settings')).toBeInTheDocument();
      expect(screen.queryByText('Redirected to /integrations/integration_id/flowBuilder/flow_id/mappings')).toBeInTheDocument();
      expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
    });

    test('should pass the initial render for save/close button without change', async () => {
      await initSettingsDrawer({
        url,
        params,
      });

      waitFor(async () => {
        expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
        expect(screen.queryByText(/Save/i)).toBeInTheDocument();
        expect(screen.queryByText(/Mock Close/i)).toBeInTheDocument();
        expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: /Mock Close/i}));
        await userEvent.click(screen.getByRole('button', {name: /Save/i}));

        expect(mockHistorygoBack).toHaveBeenCalledTimes(1);
      });
    });

    test('should pass the initial render for save/close button without change different key', async () => {
      await initSettingsDrawer({
        url,
        params,
        key: 'mapping_key_1',
      });

      expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
    });

    test('should pass the initial render for save/close button with change', async () => {
      await initSettingsDrawer({
        url,
        params,
        lookupName: 'lookup_name_2',
      });

      waitFor(async () => {
        expect(screen.queryByText(/Settings/i)).toBeInTheDocument();
        expect(screen.queryByText(/Save/i)).toBeInTheDocument();
        expect(screen.queryByText(/Mock Close/i)).toBeInTheDocument();
        expect(screen.queryByText('V2 SETTINGS render')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', {name: /Mock Close/i}));
        await userEvent.click(screen.getByRole('button', {name: /Save/i}));

        expect(mockHistorygoBack).toHaveBeenCalledTimes(1);
      });
    });
  });
});

