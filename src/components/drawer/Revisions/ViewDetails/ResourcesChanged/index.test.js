/* global describe, test, expect,afterEach, beforeEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import actions from '../../../../../actions';
import { renderWithProviders } from '../../../../../test/test-utils';
import ResourcesChanged from '.';

const props = {integrationId: 'integrationId', revisionId: 'revisionId'};

jest.mock('../../components/ResourceDiffContent', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/ResourceDiffContent'),
  default: props => <>{props.type}</>,
}));

describe('ResourcesChanged tests', () => {
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
  });

  test('Should able to test the ResourcesChanged when SnapshotCreationInProgress', async () => {
    await renderWithProviders(<ResourcesChanged {...props} />);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationLCM.compare.revisionChanges('integrationId', 'revisionId'));
  });
});

