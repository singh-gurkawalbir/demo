import * as React from 'react';
import {screen, waitFor, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MappingsSettingsV2Wrapper from './index';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.mapping = {mapping: {
    flowId: '62f0bdfaf8b63672312bbe36',
    importId: '62e6897976ce554057c0f28f',
    isGroupedSampleData: 'false',
  }};

  draft.data.resources.imports = [
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
});

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

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
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

describe('mappingsSettingsV2Wrapper test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // eslint-disable-next-line jest/prefer-spy-on
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  test('should redirect when generate is not presented in URL', () => {
    const history = createMemoryHistory();

    jest.spyOn(history, 'replace').mockImplementation();
    renderWithProviders(<Router history={history} ><MappingsSettingsV2Wrapper /></Router>);
    expect(history.replace).toHaveBeenCalledTimes(1);
  });
  test('should call history goback when clicked on close button', async () => {
    initFunction();
    await userEvent.click(screen.getByText('Close'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.mapping.v2.updateActiveKey(''));
    expect(mockGoback).toHaveBeenCalledWith();
  });
  test('should make dispatch call of patch setting when save button is clicked after changing data type', async () => {
    initFunction();

    const stringType = screen.getAllByText('string');

    await userEvent.click(stringType[0]);
    await userEvent.click(screen.getByText('[number]'));
    await userEvent.click(screen.getByText('Save'));
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
  test('should make dispatch call of patch setting and call goback function when save and close button is clicked', async () => {
    initFunction();
    const stringType = screen.getAllByText('string');

    await userEvent.click(stringType[0]);
    await userEvent.click(screen.getByText('number'));
    await fireEvent.click(document);
    await userEvent.click(stringType[0]);
    await userEvent.click(screen.getAllByText('number')[1]);
    await userEvent.click(screen.getByText('Save & close'));
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
  test('should make dispatch call of patch for object array', async () => {
    initFunction();

    const stringType = screen.getAllByRole('textbox');

    await userEvent.click(stringType[0]);
    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getByText('[object]'));
    await userEvent.click(screen.getByText('Save & close'));

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
    expect(mockGoback).toHaveBeenCalledTimes(1);
  });
  test('should show error message when no value is mapped', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Standard'));
    await userEvent.click(screen.getByText('Lookup - static'));

    await userEvent.click(screen.getByText('Save'));
    expect(screen.getByText('You need to map at least one value.')).toBeInTheDocument();
  });
  test('should make dipatch call to update look up when look up is changed', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const stringOption = screen.getByRole('menuitem', {name: 'string'});

    await userEvent.click(stringOption);
    await waitFor(() => expect(stringOption).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));

    const lookupOption = screen.getByRole('menuitem', {name: 'Lookup - static'});

    await userEvent.click(lookupOption);

    await waitFor(() => expect(lookupOption).not.toBeInTheDocument());
    await userEvent.type(screen.getAllByRole('textbox')[0], 'somdedestination');
    await userEvent.type(screen.getAllByRole('textbox')[1], 'somesource');
    const lookUpName = screen.getByPlaceholderText('Alphanumeric characters only');

    await userEvent.type(lookUpName, 'LookupName');

    await userEvent.click(screen.getByText('Save'));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
