import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import actions from '../../../../../actions';
import { getCreatedStore } from '../../../../../store';
import JavaScriptPanel from '.';

jest.mock('../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));
jest.mock('../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../Code'),
  default: props => (
    <>
      <div>{props.value}</div>
      <button type="button" onClick={() => props.onChange('new code value')}>Code Panel</button>
    </>

  ),
}));
const initialStore = getCreatedStore();

function initJavaScriptPanel(props = {}) {
  const mustateState = draft => {
    draft.session.editors = {
      filecsv: {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5b3c75dd5d3c125c88b5dd20',
        resourceType: 'imports',
        previewStatus: props.status,
        insertStubKey: 'preSavePage',
        rule: {
          code: 'custom code',
          entryFunction: 'preSavePage',
          scriptId: '5b3c75dd5d3c125c88b5cc00',
        },
      },
      '6b3c75dd5d3c125c88b5dd02': {
        fieldId: 'file.csv',
        formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
        resourceId: '5b3c75dd5d3c125c88b5dd20',
        resourceType: 'imports',
        previewStatus: props.status,
        insertStubKey: 'preSavePage',
        rule: {
          code: 'custom code',
          entryFunction: 'preSavePage',
          scriptId: '7b3c75dd5d3c125c88b5cc01',
        },
      },
      'router-XZ7DSFgUTF2': {
        editorType: 'router',
        flowId: '629f0dcfccb94d35de6f436b',
        resourceType: 'flows',
        stage: 'router',
        integrationId: '629f0dcfccb94d35de6f43w',
        rule: {
          name: '',
          routeRecordsUsing: 'script',
          id: 'XZ7DSFgUTF2',
          script: {
            _scriptId: '63daad2814f7cd246798635e',
            function: 'branching',
          },
          scriptId: '63daad2814f7cd246798635e',
          entryFunction: 'branching',
        },
        sampleDataStatus: 'received',
        dataVersion: 2,
      },
    };
    draft.session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { fields: {
      'file.csv': {
        disabled: props.disabled,
      },
    },
    }};
    draft.data.resources.flows = [{
      _id: '629f0dcfccb94d35de6f436b',
      _connectorId: '_connectorId',
    }];
    draft.data.resources.scripts = [{
      _id: '5b3c75dd5d3c125c88b5cc00',
      name: 'script 1',
      content: 'demo script content',
    }, {
      _id: '5b3c75dd5d3c125c88b5cc01',
      name: 'script 2',
      content: 'demo script content',
    }, {
      _id: '5b3c75dd5d3c125c88b5cc02',
      name: 'script 3',
      content: 'demo script content',
    }];
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<JavaScriptPanel {...props} />, {initialStore});
}
describe('javaScriptPanel UI tests', () => {
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
  test('should pass the initial render', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    expect(screen.getByText('Script')).toBeInTheDocument();
    expect(screen.getByText('Function')).toBeInTheDocument();
    const functionField = document.querySelector('[id="entryFunction"]');

    expect(functionField).toBeInTheDocument();
    const scriptField = document.querySelector('[id="scriptId"]');

    expect(scriptField).toBeInTheDocument();
    expect(screen.getByText('Insert pre save page stub')).toBeInTheDocument();
  });
  test('should have the respective default values selected for both script and function dropdowns', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});

    const defaultScript = document.querySelector('[value="5b3c75dd5d3c125c88b5cc00"]');  // value for script1 //

    expect(defaultScript).toBeInTheDocument();
    const defaultFunction = document.querySelector('[value="preSavePage"]');

    expect(defaultFunction).toBeInTheDocument();
    expect(screen.getByText('Insert pre save page stub')).toBeInTheDocument();
  });
  test('should display the scripts dropdown when clicked on selected script', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    await userEvent.click(screen.getByText('script 1'));
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('script 2')).toBeInTheDocument();
    expect(screen.getByText('script 3')).toBeInTheDocument();
  });
  test('should make the respective dispatch call and change the selected script when clicked on a menu item', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    await userEvent.click(screen.getByText('script 1'));
    expect(screen.getByText('script 2')).toBeInTheDocument();
    await userEvent.click(screen.getByText('script 2'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('filecsv', { scriptId: '5b3c75dd5d3c125c88b5cc01', fetchScriptContent: true }));
  });
  test('should make the respective dispatch call when function is changed', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    const defaultFunction = document.querySelector('[value="preSavePage"]');

    expect(defaultFunction).toBeInTheDocument();
    userEvent.type(defaultFunction, 'a');

    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('filecsv', { entryFunction: 'preSavePagea' })));
  });
  test('should close the script dropdpwn when the selected script is changed to a new script from the dropdown', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    await userEvent.click(screen.getByText('script 1'));
    expect(screen.getByText('script 2')).toBeInTheDocument();
    await userEvent.click(screen.getByText('script 2'));
    await waitFor(() => expect(screen.queryByText('script 1')).toBeNull());
    await waitFor(() => expect(screen.queryByText('script 3')).toBeNull());
  });
  test('should make the repective dispatch call when changes are made in code panel', async () => {
    initJavaScriptPanel({editorId: 'filecsv', status: 'success'});
    expect(screen.getByText('custom code')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Code Panel'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.patchRule('filecsv', {code: 'new code value'})));
  });
  test('should not make call for script content when resource belongs to integration App', async () => {
    initJavaScriptPanel({editorId: 'router-XZ7DSFgUTF2', status: 'success'});
    expect(mockDispatchFn).not.toHaveBeenCalledWith(
      actions.resource.request('scripts', '63daad2814f7cd246798635e')
    );
    const inputFunction = screen.getByRole('textbox');

    expect(inputFunction.getAttribute('value')).toBe('branching');
  });
  test('should make the repective dispatch call when script does not have content', async () => {
    initJavaScriptPanel({editorId: '6b3c75dd5d3c125c88b5dd02', status: 'success'});

    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.request('scripts', '7b3c75dd5d3c125c88b5cc01')));
  });
});
