/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { Router, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { renderWithProviders} from '../../../../test/test-utils';
import transformationAction from './transformation_afe';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('tranformation_afe UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStoreAndRender(open) {
    const history = createMemoryHistory({ initialEntries: ['/someInitialURL']});

    const {Component} = transformationAction;
    const onClose = jest.fn();

    renderWithProviders(
      <Router history={history}>
        <Route path="/:path">
          <Component
            open={open} onClose={onClose} flowId="flowId" resourceType="resourceType"
            resourceId="resourceId" />
        </Route>
      </Router>);

    return {history, onClose};
  }
  test('should test the component when open is set as true', () => {
    const {history, onClose} = initStoreAndRender(true);

    expect(history.location.pathname).toBe('/someInitialURL/editor/tx-resourceId');
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'EDITOR_INIT',
        id: 'tx-resourceId',
        editorType: 'flowTransform',
        options: {
          flowId: 'flowId',
          resourceId: 'resourceId',
          resourceType: 'resourceType',
          stage: 'transform',
        },
      }
    );
    expect(onClose).toHaveBeenCalled();
  });
  test('should test the component when open is set as false', () => {
    const {history, onClose} = initStoreAndRender(false);

    expect(history.location.pathname).toBe('/someInitialURL');
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
  test('should test name position and helpkey', () => {
    const {name, position, helpKey} = transformationAction;

    expect(name).toBe('exportTransformation');
    expect(position).toBe('right');
    expect(helpKey).toBe('fb.pg.exports.transform');
  });
});
