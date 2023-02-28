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
    importId: '638c33d9720bb0629a05f723',
    isGroupedSampleData: 'false',
  }};

  draft.data.resources.imports = [
    {
      _id: '638c33d9720bb0629a05f723',
      createdAt: '2022-12-04T05:44:57.559Z',
      lastModified: '2022-12-04T05:44:57.638Z',
      name: 'ufc',
      description: 'bk',
      _connectionId: '629f0d8accb94d35de6f4363',
      apiIdentifier: 'ia4ae5d3b0',
      ignoreExisting: false,
      ignoreMissing: false,
      oneToMany: false,
      sandbox: false,
      http: {
        relativeURI: [
          '/kjb',
        ],
        method: [
          'POST',
        ],
        body: [],
        batchSize: 1,
        sendPostMappedData: true,
        formType: 'http',
      },
      adaptorType: 'HTTPImport',
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

describe('application type Http matadata text cases', () => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show only two option of Standard and Hard coded for array Datatype', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const arrayNumber = screen.getByRole('menuitem', {name: '[number]'});

    await userEvent.click(arrayNumber);
    await waitFor(() => expect(arrayNumber).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));

    const menuItem = screen.getAllByRole('menuitem');

    const list = menuItem.map(each => each.textContent);

    expect(list).toEqual(
      ['Please select', 'Standard', 'Hard-coded']
    );
  });
  test('should show all the option for the any non array data type', async () => {
    initFunction();

    await userEvent.click(screen.getByText('Please select'));
    const numberData = screen.getByRole('menuitem', {name: 'number'});

    await userEvent.click(numberData);
    await waitFor(() => expect(numberData).not.toBeInTheDocument());
    await userEvent.click(screen.getByText('Please select'));

    const menuItem = screen.getAllByRole('menuitem');

    const list = menuItem.map(each => each.textContent);

    expect(list).toEqual(
      ['Please select', 'Standard', 'Hard-coded', 'Lookup', 'Handlebars expression']
    );
    const lookupOption = screen.getByRole('menuitem', {name: 'Lookup'});

    await userEvent.click(lookupOption);
    await waitFor(() => expect(lookupOption).not.toBeInTheDocument());

    await userEvent.click(screen.getByRole('radio', {name: 'Static'}));

    expect(screen.getByText('Destination field value')).toBeInTheDocument();
    expect(screen.getByText('Source field value')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', {name: 'Dynamic'}));

    expect(screen.getByText('Relative URI')).toBeInTheDocument();
  });
});
