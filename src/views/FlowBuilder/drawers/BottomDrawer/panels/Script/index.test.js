
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import AuditPanel from '.';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      flows: [
        {
          _id: 'flow_id_1',
          _integrationId: 'integration_id_1',
        },
      ],
      scripts: [],
    };
  });

  const ui = (
    <MemoryRouter>
      <AuditPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('AuditPanel test cases', () => {
  runServer();
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

  test('should pass the initial render with default value', async () => {
    const { utils } = await initMarketplace();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
});
