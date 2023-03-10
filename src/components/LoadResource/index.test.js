
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import LoadResource from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import actions from '../../actions';

async function initLoadResource({resourceType = 'resources', props = {}, children = '', initialStore = reduxStore} = {}) {
  const ui = (
    <MemoryRouter>
      <LoadResource resourceType={resourceType} {...props}>
        {children}
      </LoadResource>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('loadResource component', () => {
  runServer();
  let initialStore;
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = cloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'RESOURCE_REQUEST_COLLECTION':
          mutateStore(initialStore, draft => {
            draft.data.resources[action.resourceType] = 'resources';
          });
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadResource component ways to send resources', () => {
    test('should pass the initial render', async () => {
      await initLoadResource({initialStore, resourceType: 'resources', props: {resourceId: 'resource_id'}});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.request('resources', 'resource_id'));

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('loadResource component spinner', () => {
    test('should pass the initial render spinner', async () => {
      await initLoadResource({initialStore,
        children: 'Test Child',
        resourceType: 'resource_2',
        props: {
          resourceId: 'resource_id_1',
          spinner: 'Test spinner',
        },
      });
      expect(screen.queryByText('Test spinner')).toBeInTheDocument();
    });
  });

  describe('loadResource component children', () => {
    test('should pass the initial render childer there is no resouceId', async () => {
      await initLoadResource({initialStore,
        children: 'Test Child',
      });

      expect(screen.queryByText('Test Child')).toBeInTheDocument();
    });

    test('should pass the initial render childer when resource present in the state', async () => {
      mutateStore(initialStore, draft => {
        draft.session.loadResources.resources = 'received';
        draft.data.resources.resources = [{ _id: 'resource_id_1'}];
      });
      await initLoadResource({initialStore,
        children: 'Test Child',
        props: {
          resourceId: 'resource_id_1',
        },
      });

      expect(screen.queryByText('Test Child')).toBeInTheDocument();
    });

    test('should pass the initial render no childer when resource present in the state but no children', async () => {
      mutateStore(initialStore, draft => {
        draft.session.loadResources.resources = 'received';
        draft.data.resources.resources = [{ _id: 'resource_id_1'}];
      });
      await initLoadResource({initialStore,
        props: {
          resourceId: 'resource_id_1',
        },
      });

      expect(screen.queryByText('Test Child')).not.toBeInTheDocument();
    });
  });
});
