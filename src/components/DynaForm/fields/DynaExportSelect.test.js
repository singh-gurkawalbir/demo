
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import DynaExportSelect from './DynaExportSelect';
import actions from '../../../actions';

const onFieldChange = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    location: {pathname: '/'},
  }),
}));

describe('dynaExportSelect tests', () => {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      integrations: [{
        _id: '_integrationId',
        _connectionId: '_connectionId',
        _connectorId: '_connectorId',
      }],
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

  test('should able to test DynaExportSelect with proper resource', async () => {
    const props = {
      onFieldChange,
      resource: {virtual: { key: '_key'}},
      type: '',
      id: '_id',
      resourceContext: {resourceType: 'integrations', resourceId: '_integrationId'},
    };

    await renderWithProviders(<DynaExportSelect {...props} />, {initialStore});
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.exportData.request({kind: 'virtual',
      identifier: '1763109357',
      resource: {key: '_key',
        _connectionId: '_connectionId',
        _connectorId: '_connectorId'},
      resourceContext: {
        container: 'integration',
        type: 'settings',
        _integrationId: '_integrationId',
      }}));
  });
  test('should able to test DynaExportSelect without required resource', async () => {
    const props = {
      resource: {}, type: '', id: '_id', resourceContext: {resourceType: 'integrations', resourceId: ''},
    };

    await renderWithProviders(<DynaExportSelect {...props} />, {initialStore});
    expect(screen.getByText('Field id=_id, type=')).toBeInTheDocument();
    expect(screen.getByText('requires export resource.')).toBeInTheDocument();
  });
});
