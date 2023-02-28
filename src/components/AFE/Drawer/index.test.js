import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../actions';
import EditorDrawer from './index';
import { getCreatedStore } from '../../../store';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';

const initialStore = getCreatedStore();

function initEditorDrawer(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {httprelativeURI: {
      fieldId: 'file.csv',
      layout: 'compact',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      editorType: props.type,
      hidePreview: true,
    },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: '/editor/httprelativeURI'}]}>
      <Route
        path="/editor/:editorId"
        params={{editorId: 'httprelativeURI'}}
      >
        <EditorDrawer {...props} />
      </Route>
    </MemoryRouter>, {initialStore});
}

const mockOnClose = jest.fn();

jest.mock('../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right'),
  default: ({children}) => children,
}));
jest.mock('../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right/DrawerHeader'),
  default: ({children}) => children,
}));
jest.mock('../../drawer/Right/DrawerContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right/DrawerContext'),
  useDrawerContext: () => ({ onClose: mockOnClose }),
}));

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe('editorDrawer UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should render the handlebars editor drawer when editorType is handlebars', () => {
    initEditorDrawer({type: 'handlebars'});
    expect(screen.getByText('Type your handlebars template here')).toBeInTheDocument();
    expect(screen.getByText('Resources available for your handlebars template')).toBeInTheDocument();
    expect(screen.getByText('Click preview to evaluate your handlebars template')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
  test('should make a dispatch call when editor is closed', async () => {
    initEditorDrawer({type: 'handlebars'});
    expect(screen.getByText('Close')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Close'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.clear('httprelativeURI')));
  });
  test('should make a url redirection when editorType is not passed in the editorData', async () => {
    initEditorDrawer();
    await waitFor(() => expect(mockHistoryReplace).toHaveBeenCalledTimes(1));
  });
});
