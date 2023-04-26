import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as GenerateMediumId from '../../../../../../../utils/string';
import { mutateStore, renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import ImportMapping from './Mappings';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Mappings UI tests', () => {
  test('should check the dispatch call when a field is selected', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
        filters: {attributes: {someattribute: 'someattribute'}},
        mappings: {editorId: {mappings: [{key: 'key', filterType: 'someattribute', hardCodedValue: 'value', generate: 'generate'}]}},
      };
    });

    renderWithProviders(
      <MemoryRouter>
        <ImportMapping
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" editorId="editorId"
          generateFields={[{name: 'sometext2', id: 'sometext2', filterType: 'field'}]}
        />
      </MemoryRouter>, {initialStore});
    const allInputs = screen.getAllByRole('combobox');
    const input = await waitFor(() => allInputs.find(each => each.getAttribute('id') === 'fieldMappingGenerate-key'));

    await userEvent.click(input);
    await userEvent.click(screen.getByText('sometext2'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_FIELD',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: 'editorId',
        field: 'generate',
        key: 'key',
        value: 'sometext2',
      }
    );
  });
  test('should delete the category mapping', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
        filters: {attributes: {someattribute: 'someattribute'}},
        mappings: {editorId: {mappings: [{key: 'key', filterType: 'someattribute', hardCodedValue: 'value', generate: 'generate'}]}},
      };
    });

    renderWithProviders(
      <MemoryRouter>
        <ImportMapping
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" editorId="editorId"
          generateFields={[{name: 'sometext2', id: 'sometext2', filterType: 'preferred'}]}
        />
      </MemoryRouter>, {initialStore});
    const allButton = screen.getAllByRole('button');

    const deleteButton = allButton.find(each => each.getAttribute('data-test') === 'fieldMappingRemove-key');

    await userEvent.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_DELETE',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: 'editorId',
        key: 'key',
      }
    );
  });
  test('should choose a field mapping generate option', async () => {
    jest.spyOn(GenerateMediumId, 'generateId').mockReturnValue('someGeneratedId');
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
        filters: {attributes: {someattribute: 'someattribute'}},
        mappings: {editorId: {mappings: [{key: 'key', filterType: 'preferred', generate: 'generate'}]}},
      };
    });

    renderWithProviders(
      <MemoryRouter>
        <ImportMapping
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" editorId="editorId"
          generateFields={[{name: 'sometext2', id: 'sometext2', filterType: 'field'}, '']}
        />
      </MemoryRouter>, {initialStore});
    const allInput = screen.getAllByRole('combobox');
    const input = allInput.find(each => each.getAttribute('id') === 'fieldMappingGenerate-someGeneratedId');

    await userEvent.click(input);
    const emptystring = screen.getAllByRole('option')[1];

    await userEvent.click(emptystring);

    expect(mockDispatch).toHaveBeenCalled();
  });
  test('should choose a Field mapping extract option', async () => {
    jest.spyOn(GenerateMediumId, 'generateId').mockReturnValue('someGeneratedId');

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
        filters: {attributes: {someattribute: 'someattribute'}},
        mappings: {editorId: {mappings: [{key: 'key', filterType: 'optional', generate: 'generate'}]}},
        response: [{operation: 'extractsMetaData', data: [{name: 'extractsMetaData', id: 'extractsMetaData', filterType: 'optional', key: 'somekey'}]}],
      };
    });

    renderWithProviders(
      <MemoryRouter>
        <ImportMapping
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" editorId="editorId"
          generateFields={[{name: 'sometext2', id: 'sometext2', filterType: 'optional'}, '']}
        />
      </MemoryRouter>, {initialStore});
    const allInput = screen.getAllByRole('combobox');
    const input = allInput.find(each => each.getAttribute('id') === 'fieldMappingExtract-someGeneratedId');

    await userEvent.click(input);

    await userEvent.click(screen.getByText('extractsMetaData'));

    await input.blur();

    expect(mockDispatch).toHaveBeenCalled();
  });
  test('should check different icon for different filters', async () => {
    jest.spyOn(GenerateMediumId, 'generateId').mockReturnValue('someGeneratedId');

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
        filters: {attributes: {someattribute: 'someattribute'}},
        mappings: {editorId: {mappings: [{key: 'key', filterType: 'optional', generate: 'generate'}]}},
        response: [{operation: 'extractsMetaData', data: [{name: 'extractsMetaData', id: 'extractsMetaData', filterType: 'optional', key: 'somekey'}]}],
      };
    });

    renderWithProviders(
      <MemoryRouter>
        <ImportMapping
          integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152" editorId="editorId"
          generateFields={[
            {name: 'sometext2', id: 'sometext2', filterType: 'preferred'},
            {name: 'sometext3', id: 'sometext3', filterType: 'optional'},
            {name: 'sometext4', id: 'sometext4', filterType: 'required'},
            {name: 'sometext5', id: 'sometext5', filterType: 'conditional'}]}
        />
      </MemoryRouter>, {initialStore});
    const allInput = screen.getAllByRole('combobox');
    const input = allInput.find(each => each.getAttribute('id') === 'fieldMappingGenerate-someGeneratedId');

    await userEvent.click(input);

    const preferred = screen.getByText('sometext2');

    expect(preferred).toBeInTheDocument();

    const optional = screen.getByText('sometext3');

    expect(optional).toBeInTheDocument();
    const required = screen.getByText('sometext4');

    expect(required).toBeInTheDocument();
    const conditional = screen.getByText('sometext5');

    expect(conditional).toBeInTheDocument();
  });
});
