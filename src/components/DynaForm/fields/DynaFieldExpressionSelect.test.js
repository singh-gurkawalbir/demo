
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import DynaFieldExpressionSelect from './DynaFieldExpressionSelect';
import actions from '../../../actions';

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

describe('dynaFieldExpressionSelect tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors = {
      helperFunctions: {
        abs: '{{abs field}}',
        timestamp: '{{timestamp format timezone}}',
      },
    };
  });

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
  test('should able to test DynaFieldExpressionSelect', async () => {
    await renderWithProviders(<DynaFieldExpressionSelect />, {initialStore});
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.refreshHelperFunctions());
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.getByRole('menuitem', {name: 'Please select'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'abs'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'timestamp'})).toBeInTheDocument();
  });
});
