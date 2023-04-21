import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';

import RefreshSearchFilters from '.';

const initialStore = getCreatedStore();

function initRefreshSearchFilters(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      filecsv: {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5b3c75dd5d3c125c88b5dd20',
        editorType: 'salesforceLookupFilter',
        resourceType: 'imports',
        isSuiteScriptData: true,
        customOptions: {commMetaPath: 'testCommMetaPath', disableFetch: props.fetch},
      },
    };
    draft.session.metadata = {application: {'6b3c75dd5d3c125c88b5dd20': {
      testCommMetaPath: {
        data: props.data,
      },
    },
    }};
    draft.data.resources = {imports: [
      {_id: '5b3c75dd5d3c125c88b5dd20',
        name: 'import1',
        _connectionId: '6b3c75dd5d3c125c88b5dd20',
        adaptorType: 'FTPImport',
      },
    ],
    exports: [
      {_id: '5b3c75dd5d3c125c88b5dd21',
        name: 'export1',
        adaptorType: 'HTTPImport',
      },
    ],
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<RefreshSearchFilters {...props} />, {initialStore});
}

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (
    <div>Loading...</div>

  ),
}));

describe('refreshSearchFilters UI tests', () => {
  const data = {
    fields: [
      {
        label: 'test label',
        value: 'test',
        type: 'demo',
        updateable: 'false',
      },
    ],
  };

  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render', () => {
    initRefreshSearchFilters({editorId: 'filecsv', data});
    expect(screen.getByText('Refresh search filters')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();                 // refresh icon //
  });
  test('should make 2 dispatch calls on initial render', async () => {
    initRefreshSearchFilters({editorId: 'filecsv', data});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request('6b3c75dd5d3c125c88b5dd20', 'testCommMetaPath')));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchFeatures('filecsv', {
      filters: [
        {
          label: 'test label',
          value: undefined,
          custom: undefined,
          triggerable: undefined,
          picklistValues: undefined,
          type: 'demo',
          updateable: 'false',
        },
      ],
    })));
  });
  test('should make a dispatch call when clicked on the refresh icon', async () => {
    initRefreshSearchFilters({editorId: 'filecsv', data});
    const refreshIcon = screen.getByRole('button');

    expect(refreshIcon).toBeInTheDocument();
    await userEvent.click(refreshIcon);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request('6b3c75dd5d3c125c88b5dd20', 'testCommMetaPath', {refreshCache: true })));
  });
  test('should display the loading spinner when search filters are not present', () => {
    initRefreshSearchFilters({editorId: 'filecsv'});
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
