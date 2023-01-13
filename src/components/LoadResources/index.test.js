
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import cloneDeep from 'lodash/cloneDeep';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import LoadResources from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore } from '../../test/test-utils';
import actions from '../../actions';

async function initLoadResources({resources = 'resources', props = {}, children = '', initialStore = reduxStore, defaultAShareId = 'own'} = {}) {
  /* eslint no-param-reassign: "error" */
  initialStore.getState().user = {
    preferences: {
      defaultAShareId,
    },
  };
  const ui = (
    <MemoryRouter>
      <LoadResources resources={resources} {...props}>
        {children}
      </LoadResources>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('loadResources component', () => {
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
          initialStore.getState().data.resources[action.resourceType] = 'resources';
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });

  describe('loadResources component ways to send resources', () => {
    test('should pass the initial render', async () => {
      const { utils } = await initLoadResources({initialStore, resources: 'resources'});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.resource.requestCollection('resources_1', undefined, undefined, undefined));

      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render with multiple resources', async () => {
      const { utils } = await initLoadResources({initialStore, resources: 'resources_2, resources_3'});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_2', undefined, undefined, undefined));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_3', undefined, undefined, undefined));
      expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render array of resources', async () => {
      const { utils } = await initLoadResources({initialStore, resources: ['resources_4', 'resources_5']});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_4', undefined, undefined, undefined));
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_5', undefined, undefined, undefined));
      expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render send resource as recycleBinTTL', async () => {
      const { utils } = await initLoadResources({initialStore, resources: 'recycleBinTTL', defaultAShareId: ''});

      await expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.resource.requestCollection('recycleBinTTL', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });
  });

  describe('loadResources component ways to send lazyResources', () => {
    test('should pass the initial render array of lazyResources', async () => {
      const { utils } = await initLoadResources({initialStore,
        props: {
          lazyResources: ['resources_6', 'resources_7'],
        }});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_6', undefined, undefined, undefined));
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_7', undefined, undefined, undefined));
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render string of lazyResources', async () => {
      const { utils } = await initLoadResources({initialStore,
        props: {
          lazyResources: 'resources_6, resources_7',
        }});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_6', undefined, undefined, undefined));
      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources_7', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });

    test('should pass the initial render array of lazyResources contains resources', async () => {
      const { utils } = await initLoadResources({initialStore,
        props: {
          lazyResources: ['resources', 'resources_7'],
        }});

      await expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestCollection('resources', undefined, undefined, undefined));
      expect(utils.container).toBeEmptyDOMElement();
    });
  });

  describe('loadResources component required', () => {
    test('should pass the initial render required true', async () => {
      const { utils } = await initLoadResources({initialStore,
        props: {
          required: true,
        }});

      expect(utils.container).toBeEmptyDOMElement();
    });
  });

  describe('loadResources component spinner', () => {
    test('should pass the initial render spinner', async () => {
      await initLoadResources({initialStore,
        children: 'Test Child',
        resources: 'resource_2',
        props: {
          required: true,
          spinner: 'Test spinner',
        },
      });
      expect(screen.queryByText('Test spinner')).toBeInTheDocument();
    });
  });

  describe('loadResources component children', () => {
    test('should pass the initial render childer when resource = lazyResources and not ready', async () => {
      await initLoadResources({initialStore,
        children: 'Test Child',
        props: {
          lazyResources: ['resources'],
          required: true,
        }});

      expect(screen.queryByText('Test Child')).toBeInTheDocument();
    });

    test('should pass the initial render childer when resource != lazyResources and ready', async () => {
      initialStore.getState().session.loadResources.resources = 'received';
      await initLoadResources({initialStore,
        children: 'Test Child',
        props: {
          required: true,
        },
      });

      expect(screen.queryByText('Test Child')).toBeInTheDocument();
    });
  });
});
