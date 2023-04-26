
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import ExpandAllResourceDiff from '.';

async function initExpandAllResourceDiff(props = {}, expandAll) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement = {
      compare: {
        _integrationId: {expandAll, status: 'received'},
      },
    };
  });

  return renderWithProviders(<ExpandAllResourceDiff {...props} />, {initialStore});
}
describe('ExpandAllResourceDiff tests', () => {
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
  });
  test('Should able to test the initial render with resourceDiff default collapsed', async () => {
    await initExpandAllResourceDiff({integrationId: '_integrationId'});
    const expandButton = screen.getByRole('button', {name: 'Expand all'});

    expect(expandButton).toBeEnabled();
    await userEvent.click(expandButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.compare.toggleExpandAll('_integrationId'));
  });
  test('Should able to test the initial render with resourceDiff expanded', async () => {
    await initExpandAllResourceDiff({integrationId: '_integrationId'}, 'true');
    const collapseButton = screen.getByRole('button', {name: 'Collapse all'});

    expect(collapseButton).toBeEnabled();
    await userEvent.click(collapseButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.compare.toggleExpandAll('_integrationId'));
  });
});
