
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';
import useHandleSubmitCompleteFn from './useHandleSubmitCompleteFn';

const mockOnClose = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
async function inituseHandleSubmitCompleteFn(resourceType, operation = 'add', id = '_resourceId') {
  const DummyComponent = () => {
    const handleSubmitComplete = useHandleSubmitCompleteFn(resourceType, id, mockOnClose);

    return (<button type="button" onClick={handleSubmitComplete}> Submit</button>);
  };

  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.resource = {
      'new-integration': 'new-integration',
    };
    draft.session.resourceForm = {
      'scripts-new-script': {
        skipClose: true,
      },
      'exports-_exportId': {
        skipClose: true,
      },
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/${operation}/${resourceType}/${id}`}]}>
      <Route path="/:operation/:resourceType/:id" >
        <DummyComponent />
      </Route>
    </MemoryRouter>
  );

  await renderWithProviders(ui, {initialStore});
}
describe('useHandleSubmitCompleteFn tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    mockHistoryReplace.mockClear();
    mockOnClose.mockClear();
  });
  test('Should able to test the custom hook with new pageGenerator', async () => {
    await inituseHandleSubmitCompleteFn('pageGenerator');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/edit/exports/_resourceId');
  });
  test('Should able to test the custom hook with new integration', async () => {
    await inituseHandleSubmitCompleteFn('integrations', 'add', 'new-integration');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockHistoryReplace).not.toHaveBeenCalledWith('/add/integrations/new-integration');
  });
  test('Should able to test the custom hook with new script with skipClose', async () => {
    await inituseHandleSubmitCompleteFn('scripts', 'add', 'new-script');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.created(undefined, 'new-script'));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/edit/scripts/new-script');
  });
  test('Should able to test the custom hook with new API', async () => {
    await inituseHandleSubmitCompleteFn('apis', 'add', 'new-api');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.created(undefined, 'new-api'));
    expect(mockOnClose).toHaveBeenCalled();
  });
  test('Should able to test the custom hook with edit export with skipClose', async () => {
    await inituseHandleSubmitCompleteFn('exports', 'edit', '_exportId');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/edit/exports/_exportId');
  });
  test('Should able to test the custom hook with edit connection without skipClose', async () => {
    await inituseHandleSubmitCompleteFn('connections', 'edit', '_connectionId');
    await userEvent.click(screen.getByRole('button', {name: 'Submit'}));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
