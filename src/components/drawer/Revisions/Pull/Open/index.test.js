
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';
import OpenPullDrawer from '.';
import actionTypes from '../../../../../actions/types';

const props = {integrationId: '_integrationId'};
const mockHistoryReplace = jest.fn();

async function initOpenPullDrawer(props = {}, hasCloneFamily = false) {
  const initialStore = reduxStore;

  initialStore.getState().session.lifeCycleManagement = {
    cloneFamily: {
      _integrationId: {
        status: 'completed',
        cloneFamily: hasCloneFamily ? [{}] : [],
      },
    },
  };
  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'pull/_revisionId/open'}]}>
      <OpenPullDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

jest.mock('../../../../DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../DynaForm/DynaSubmit'),
  default: props => <button type="button" onClick={() => props.onClick({description: 'desc', integration: {value: '_int'}})}>Next</button>,

}));

describe('OpenPullDrawer tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = cloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case actionTypes.INTEGRATION_LCM.REVISION.OPEN_PULL:
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should able to test the OpenPullDrawer initial render without snackbar', async () => {
    await initOpenPullDrawer(props, true);
    const close = screen.getAllByRole('button', {name: 'Close'})[0];
    const next = screen.getByRole('button', {name: 'Next'});

    expect(close).toBeInTheDocument();
    userEvent.click(close);
    expect(mockHistoryReplace).toHaveBeenNthCalledWith(1, '/');
    userEvent.click(next);
    expect(mockHistoryReplace).toHaveBeenNthCalledWith(2, '//pull/_revisionId/review');
  });

  test('Should able to test the OpenPullDrawer initial render', async () => {
    await initOpenPullDrawer(props);
    expect(screen.getByRole('heading', {name: 'Create pull'})).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Integration')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getAllByText('*')).toHaveLength(2);
    const helpKeys = screen.getAllByRole('button', {name: ''}).filter(b => b.getAttribute('class').includes('iconButton'));

    userEvent.click(helpKeys[0]);
    expect(screen.getByText('Enter text describing the changes you are pulling into your integration.')).toBeInTheDocument();
    userEvent.click(helpKeys[1]);
    expect(screen.getByText('Select the remote production or sandbox integration from which you pull changes. All linked integrations are displayed, which includes clones of this integration and the integration from which it was cloned.')).toBeInTheDocument();
  });
});
