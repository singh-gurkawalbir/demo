
import React from 'react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import useHandleInvalidRevision from './useHandleInvalidRevision';

const mockHistoryReplace = jest.fn();
const props = { integrationId: '_integrationId', revisionId: '_revId', parentUrl: '/parentUrl' };

const MockComponent = props => {
  useHandleInvalidRevision(props);

  return null;
};

async function inituseHandleInvalidRevision(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.revisions = {
      _integrationId: {
        data: props.revisionId ? [{_id: '_revId'}] : [],
      },
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
describe('useHandleInvalidRevision tests', () => {
  afterEach(() => {
    mockHistoryReplace.mockClear();
  });
  test('Should able to test the hook with valid revision', async () => {
    await inituseHandleInvalidRevision(props);
    expect(mockHistoryReplace).not.toHaveBeenCalledWith('/parentUrl');
  });
  test('Should able to test the hook with invalid revision', async () => {
    await inituseHandleInvalidRevision({...props, revisionId: undefined});
    expect(mockHistoryReplace).toHaveBeenCalledWith('/parentUrl');
  });
});
