
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import DynaIclient from './DynaIclient';

const mockDispatchFn = jest.fn();

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

jest.mock('./DynaSelectResource', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaSelectResource'),
  default: ({addTitle, editTitle, disabledTitle}) => (
    <div data-testid="dynaSelectResource">
      <span data-testid="addTitle">{addTitle}</span>
      <span data-testid="editTitle">{editTitle}</span>
      <span data-testid="disabledTitle">{disabledTitle}</span>
    </div>
  ),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaIclient field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should not render the field if hideFromUI flag is set', () => {
    const props = {
      connectionId: 'connection-123',
      hideFromUI: true,
    };

    renderWithProviders(<DynaIclient {...props} />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });

  test('should be able to select from available iClients if associated with a connector', async () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'iClients',
      connectorId: 'connector123',
      label: 'iClient',
      connectionId: 'connection123',
      id: 'http._iClientId',
      name: '/http/_iClientId',
      formKey: 'connections-connection123',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.connections.iClients = {
        [props.connectionId]: [
          {name: 'Client 1', _id: 'client1'},
          {_id: 'client2'},
        ],
      };
    });

    renderWithProviders(<DynaIclient {...props} />, {initialStore});
    expect(mockDispatchFn).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    await waitFor(() => {
      const availableIclients = screen.getAllByRole('menuitem').map(ele => ele.textContent);

      expect(availableIclients).toEqual([
        'Please select',
        'Client 1',
        'client2',
      ]);
    });
  });

  test('should be allowed to create or modify iClient', () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'iClients',
      label: 'iClient',
      allowNew: true,
      allowEdit: true,
      connectionId: 'connection123',
      id: 'http._iClientId',
      name: '/http/_iClientId',
      formKey: 'connections-connection123',
    };

    renderWithProviders(<DynaIclient {...props} />);
    expect(screen.getByTestId('dynaSelectResource')).toBeInTheDocument();
    expect(screen.getByTestId('addTitle')).toHaveTextContent('Create iClient');
    expect(screen.getByTestId('editTitle')).toHaveTextContent('Edit iClient');
    expect(screen.getByTestId('disabledTitle')).toHaveTextContent('Select an iClient to allow editing');
    expect(mockDispatchFn).not.toHaveBeenCalled();
  });

  test('should request for iClients if assosciated with connector', () => {
    const props = {
      resourceId: 'connection123',
      resourceType: 'iClients',
      connectorId: 'connector123',
      label: 'iClient',
      allowNew: true,
      allowEdit: true,
      connectionId: 'connection123',
      id: 'http._iClientId',
      name: '/http/_iClientId',
      formKey: 'connections-connection123',
    };

    renderWithProviders(<DynaIclient {...props} />);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.connections.requestIClients(props.connectionId));
  });
});
