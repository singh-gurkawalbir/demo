import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { createMemoryHistory } from 'history';
import getRoutePath from '../../utils/routePaths';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import ChangeEmail from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth) {
  mutateStore(initialStore, draft => {
    draft.auth = auth;
  });
}

async function initChangeEmail(props) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: props.pathname}]} >
      <Route
        path="/change-email/:token"
        params={{token: props.match.params.token}}
      >
        <ChangeEmail {...props} />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('Change email', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AUTH_REQUEST':
          initialStore.dispatch(action);
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });

  test('Should able to test Failure page', async () => {
    const props = {
      match: {
        params: {
          token: '5fc5e0e66cfe5b44bb95de70',
        },
      },
      pathname: '/change-email/5fc5e0e66cfe5b44bb95de70',
      history: {
        push: jest.fn(),
      },
    };

    store({changeEmailStatus: 'failed'});

    await initChangeEmail(props);
    const forgotpasswordHeadingNode = screen.getByRole('heading', {name: 'Failed to change email address.'});

    expect(forgotpasswordHeadingNode).toBeInTheDocument();
  });

  test('Should able to test Success case', async () => {
    const props = {
      match: {
        params: {
          token: '5fc5e0e66cfe5b44bb95de70',
        },
      },
      pathname: '/change-email/5fc5e0e66cfe5b44bb95de70',
      history: {
        push: jest.fn(),
      },
    };

    store({changeEmailStatus: 'success'});
    const history = createMemoryHistory();

    history.replace = jest.fn();
    await initChangeEmail(props);
    expect(history.location.pathname).toBe(getRoutePath('/'));
  });
});
