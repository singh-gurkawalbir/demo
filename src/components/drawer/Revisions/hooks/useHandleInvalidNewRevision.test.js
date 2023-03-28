
import React from 'react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import useHandleInvalidNewRevision from './useHandleInvalidNewRevision';

const mockHistoryReplace = jest.fn();
const props = { integrationId: '_integrationId', revisionId: '_revId', parentUrl: '/parentUrl' };

const MockComponent = props => {
  useHandleInvalidNewRevision(props);

  return null;
};

async function inituseHandleInvalidNewRevision(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement.revision = {
      _integrationId: props.revisionId ? {
        _revId: {},
      } : undefined,
    };
  });

  return renderWithProviders(<MockComponent {...props} />, {initialStore});
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
describe('useHandleInvalidNewRevision tests', () => {
  afterEach(() => {
    mockHistoryReplace.mockClear();
  });
  test('Should able to test the hook with valid new revision', async () => {
    await inituseHandleInvalidNewRevision(props);
    expect(mockHistoryReplace).not.toHaveBeenCalledWith('/parentUrl');
  });
  test('Should able to test the hook with invalid new revision', async () => {
    await inituseHandleInvalidNewRevision({...props, revisionId: undefined});
    expect(mockHistoryReplace).toHaveBeenCalledWith('/parentUrl');
  });
});
