/* global describe, test, expect, jest, afterEach */
import * as React from 'react';
import {screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Router, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import MappingsSettingsV2Wrapper from './index';
import { renderWithProviders, reduxStore} from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

const initialStore = reduxStore;

initialStore.getState().session.mapping = {mapping: {
  flowId: '62f0bdfaf8b63672312bbe36',
  importId: '62e6897976ce554057c0f28f',
  isGroupedSampleData: 'false',
}};

initialStore.getState().data.resources.imports = [
  {
    _id: '62e6897976ce554057c0f28f',
    createdAt: '2022-07-31T13:54:01.216Z',
    lastModified: '2022-07-31T13:54:01.275Z',
    name: 'sample',
    parsers: [],
    _connectionId: '629f0cb2d5391a2e79b99d99',
    apiIdentifier: 'if8efa1e5d',
    oneToMany: false,
    sandbox: false,
    file: {
      fileName: 'file-{{timestamp}}.csv',
      type: 'csv',
      csv: {
        rowDelimiter: '\n',
        columnDelimiter: ',',
        includeHeader: true,
        wrapWithQuotes: false,
        replaceTabWithSpace: false,
        replaceNewlineWithSpace: false,
        truncateLastRowDelimiter: false,
      },
    },
    ftp: {
      directoryPath: '/',
      fileName: 'file-{{timestamp}}.csv',
    },
    adaptorType: 'FTPImport',
  },
];

jest.mock('../../../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

const mockGoback = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockGoback,
  }),
}));
const mockDispatch = jest.fn(action => {
  if (action.type !== 'MAPPING_UPDATE_LOOKUP') { initialStore.dispatch(action); }
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initFunction() {
  const ui = (
    <MemoryRouter initialEntries={['/generateValue/someNodeKey']} >
      <Route path="/:generate/:nodeKey">
        <MappingsSettingsV2Wrapper />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('MappingsSettingsV2Wrapper test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  test('should redirect when generate is not presented in URL', () => {
    const history = createMemoryHistory();

    history.replace = jest.fn();
    renderWithProviders(<Router history={history} ><MappingsSettingsV2Wrapper /></Router>);
    expect(history.replace).toHaveBeenCalled();
  });
  test('should call history goback when clicked on close button', () => {
    initFunction();
    userEvent.click(screen.getByText('Close'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.mapping.v2.updateActiveKey(''));
    expect(mockGoback).toHaveBeenCalledWith();
  });
  test('should make dispatch call of patch setting when save button is clicked after changing data type', () => {
    initFunction();

    const stringType = screen.getAllByText('string');

    userEvent.click(stringType[0]);
    userEvent.click(screen.getByText('[number]'));
    userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchSettings('someNodeKey',
        {
          generate: undefined,
          description: undefined,
          sourceDataType: 'numberarray',
          dataType: 'string',
          copySource: 'no',
          extractDateFormat: undefined,
          extractDateTimezone: undefined,
          generateDateFormat: undefined,
          generateDateTimezone: undefined,
          conditional: { when: 'extract_not_empty' },
        }
      )
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchField('extract', 'someNodeKey', '', true)
    );
  });
  test('should make dispatch call of patch setting and call goback function when save and close button is clicked', () => {
    initFunction();
    const stringType = screen.getAllByText('string');

    userEvent.click(stringType[0]);
    userEvent.click(screen.getByText('number'));
    fireEvent.click(document);
    userEvent.click(stringType[0]);
    userEvent.click(screen.getAllByText('number')[1]);
    userEvent.click(screen.getByText('Save & close'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchSettings('someNodeKey',
        {
          generate: undefined,
          description: undefined,
          sourceDataType: 'number',
          dataType: 'string',
          copySource: 'no',
          extractDateFormat: undefined,
          extractDateTimezone: undefined,
          generateDateFormat: undefined,
          generateDateTimezone: undefined,
          conditional: { when: 'extract_not_empty' },
        }
      )
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchField('extract', 'someNodeKey', '', true)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateActiveKey('')
    );
    expect(mockGoback).toHaveBeenCalledWith();
  });
  test('should make dispatch call of patch for object array ', () => {
    initFunction();

    const stringType = screen.getAllByRole('textbox');

    userEvent.click(stringType[0]);
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('[object]'));
    userEvent.click(screen.getByText('Save & close'));

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchSettings('someNodeKey',
        {
          generate: undefined,
          description: undefined,
          extract: undefined,
          dataType: 'objectarray',
          extractsArrayHelper: [],
        }
      )
    );
    expect(mockGoback).toHaveBeenCalled();
  });
  test('should show error message when no value is mapped', () => {
    initFunction();

    userEvent.click(screen.getByText('Standard'));
    userEvent.click(screen.getByText('Lookup - static'));

    userEvent.click(screen.getByText('Save'));
    expect(screen.getByText('You need to map at least one value.')).toBeInTheDocument();
  });
  test('should make dipatch call to update look up when look up is changed', async () => {
    initFunction();

    userEvent.click(screen.getByText('Please select'));
    const stringOption = screen.getByRole('menuitem', {name: 'string'});

    userEvent.click(stringOption);
    await waitFor(() => expect(stringOption).not.toBeInTheDocument());
    userEvent.click(screen.getByText('Please select'));

    const lookupOption = screen.getByRole('menuitem', {name: 'Lookup - static'});

    userEvent.click(lookupOption);

    await waitFor(() => expect(lookupOption).not.toBeInTheDocument());
    userEvent.type(screen.getAllByRole('textbox')[0], 'somdedestination');
    userEvent.type(screen.getAllByRole('textbox')[1], 'somesource');
    const lookUpName = screen.getByPlaceholderText('Alphanumeric characters only');

    userEvent.type(lookUpName, 'LookupName');

    userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.updateLookup({oldValue: undefined,
        newValue: {
          name: 'LookupName',
          map: { somesource: 'somdedestination' },
          allowFailures: false,
        },
        isConditionalLookup: false})
    );
  });
});
