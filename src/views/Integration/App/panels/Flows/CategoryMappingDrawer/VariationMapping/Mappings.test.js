/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../../store';
import ImportMapping from './Mappings';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('ImportMapping(of VariationMapping) UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function initStoreAndRender(isRequired) {
    const initialStore = getCreatedStore();

    initialStore.getState().session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'] = {
      mappings: [{key: 'someKey', generate: 'sometext'}],
      response: [
        {operation: 'extractsMetaData', data: [{name: 'sometext2', id: 'sometext2', filterType: 'field'}]},
      ],
      generatesMetadata: [{
        id: 'categoryId',
        fields: [{name: 'sometext2', id: 'sometext2', filterType: 'field'}],
      }]};
    initialStore.getState().session.integrationApps.settings['5ea16c600e2fab71928a6152-5ff579d745ceef7dcd797c15'].mappings.editorId = {
      mappings: [{key: 'someKey', generate: 'sometext', isRequired}]};
    renderWithProviders(
      <MemoryRouter><ImportMapping
        integrationId="5ff579d745ceef7dcd797c15" flowId="5ea16c600e2fab71928a6152"
        categoryId="categoryId" editorId="editorId"
        />
      </MemoryRouter>, {initialStore});
  }
  test('should test the change in mapping fields', () => {
    initStoreAndRender();
    const mappingtext = screen.getByText('sometext');

    expect(mappingtext).toBeInTheDocument();
    const textbox = screen.getAllByRole('textbox')[0];

    fireEvent.focusIn(textbox);
    fireEvent.focusOut(textbox);
    userEvent.click(screen.getByText('sometext2'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_FIELD',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: 'editorId',
        field: 'generate',
        key: 'someKey',
        value: 'sometext2',
      });
  });
  test('should test the delete button', () => {
    initStoreAndRender();
    const deletebutton = screen.getAllByRole('button', { label: 'delete'})[0];

    userEvent.click(deletebutton);

    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_DELETE',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: 'editorId',
        key: 'someKey',
      }
    );
  });
  test('should test the change in extract mapping fields and required tootip', () => {
    initStoreAndRender(true);
    const mappingtext = screen.getByText('sometext');

    expect(screen.getByTitle('This field is required by the application you are importing into')).toBeInTheDocument();

    expect(mappingtext).toBeInTheDocument();
    const textbox = screen.getAllByRole('textbox')[1];

    fireEvent.focusIn(textbox);
    fireEvent.focusOut(textbox);
    userEvent.click(screen.getByText('sometext2'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_FIELD',
        integrationId: '5ff579d745ceef7dcd797c15',
        flowId: '5ea16c600e2fab71928a6152',
        id: 'editorId',
        field: 'extract',
        key: 'someKey',
        value: 'sometext2',
      });
  });
});
