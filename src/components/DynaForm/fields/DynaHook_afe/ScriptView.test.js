
import React from 'react';
import {
  waitFor, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import ScriptView from './ScriptView';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initScriptView(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {scripts: [{
      _id: '63342b57bb74b66e32a93e5d',
      lastModified: '2022-10-09T23:07:36.439Z',
      createdAt: '2022-09-28T11:09:11.773Z',
      name: 'AmazonS3PreSavePageDND',
    },
    {
      _id: '631b5521798cc1729e88a76d',
      lastModified: '2022-10-10T08:08:55.632Z',
      createdAt: '2022-09-09T15:00:49.149Z',
      name: 'Branching Script',
    },
    {
      _id: '634664b80eeae84271ab534e',
      lastModified: '2022-10-12T07:09:20.908Z',
      createdAt: '2022-10-12T06:54:48.727Z',
      name: 'DND_47506',
    },
    ]};
  });
  const ui = (
    <MemoryRouter>
      <ScriptView {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
const mockOnFieldChange = jest.fn();
const mockisValidHookField = jest.fn();
const mockhandleFieldChange = jest.fn();
const mockhandleCreateScriptClick = jest.fn();

describe('scriptView UI tests', () => {
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
  const props = {
    id: 'id',
    flowId: '67r912e45gferb4378900r5ef374',
    disabled: false,
    name: 'test name',
    onFieldChange: mockOnFieldChange,
    placeholder: 'function field',
    required: true,
    value: {},
    formKey: 'imports-56r912e45gferb43r5ef374',
    hookType: 'script',
    hookStage: 'preSavePage',
    resourceType: 'imports',
    resourceId: '56r912e45gferb47u6r5ef374',
    isValidHookField: mockisValidHookField,
    handleFieldChange: mockhandleFieldChange,
    handleCreateScriptClick: mockhandleCreateScriptClick,
    isLoggable: true,
    isValid: true,
  };

  test('should pass the initial render', async () => {
    initScriptView(props);
    expect(document.querySelector('[id="scriptId"]')).toBeInTheDocument();
    expect(screen.getByLabelText('Create script')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit script')).toBeInTheDocument();
  });
  test('should call the "handleCreateScriptClick" function passed in props when clicked on create script button', async () => {
    initScriptView(props);
    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[2]);
    expect(mockhandleCreateScriptClick).toHaveBeenCalled();
  });
  test('should render disabled button for editscript when value prop does not contain scriptId', () => {
    initScriptView(props);
    const buttons = screen.getAllByRole('button');

    expect(buttons[3]).toBeDisabled();
  });
  test('should make a dispatch call and a redirection when clicked on edit script button', async () => {
    const newprops = {...props, value: {_scriptId: 'scriptId'}};

    initScriptView(newprops);
    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[3]);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('//editor/id'));
  });
  test('should render the scripts options when clicked on scripts dropdown', async () => {
    initScriptView(props);
    const dropdown = screen.getByText('None');

    await userEvent.click(dropdown);
    expect(screen.getByText('AmazonS3PreSavePageDND')).toBeInTheDocument();
    expect(screen.getByText('Branching Script')).toBeInTheDocument();
    expect(screen.getByText('DND_47506')).toBeInTheDocument();
  });
});
