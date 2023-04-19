import * as React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import MappingsSettingsV2Wrapper from '../../index';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../../../../../test/test-utils';

const initialStore = reduxStore;

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

jest.mock('../../../../../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
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

describe('metadata for FTP type file test cases', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show only two option for array type data', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const numberArray = screen.getByRole('menuitem', {name: '[number]'});

    await userEvent.click(numberArray);
    await waitFor(() => expect(numberArray).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));

    const menuItem = screen.getAllByRole('menuitem');

    const list = menuItem.map(each => each.textContent);

    expect(list).toEqual(
      ['Please select', 'Standard', 'Hard-coded']
    );
  });
  test('should show handle look up change option for date field should be shown', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const numberOption = screen.getByRole('menuitem', {name: 'number'});

    await userEvent.click(numberOption);
    await waitFor(() => expect(numberOption).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));
    const standardOption = screen.getByRole('menuitem', {name: 'Standard'});

    await userEvent.click(standardOption);

    await waitFor(() => expect(standardOption).not.toBeInTheDocument());

    expect(screen.getByText('Destination field is date field')).toBeInTheDocument();
  });
  test('should not show option for data field for boolean data', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const booleanOption = screen.getByRole('menuitem', {name: 'boolean'});

    await userEvent.click(booleanOption);
    await waitFor(() => expect(booleanOption).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));
    const standardOption = screen.getByRole('menuitem', {name: 'Standard'});

    await userEvent.click(standardOption);

    await waitFor(() => expect(standardOption).not.toBeInTheDocument());

    expect(screen.queryByText('Destination field is date field')).not.toBeInTheDocument();
  });
});
