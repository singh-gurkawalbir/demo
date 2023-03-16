import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import MockOutputDrawer from '.';
import { DrawerProvider } from '../../../../drawer/Right/DrawerContext';
import actions from '../../../../../actions';
import errorMessageStore from '../../../../../utils/errorStore';

jest.mock('../../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right'),
  default: ({children}) => <span>{children}</span>,
}));

jest.mock('../../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../CodeEditor'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <>
        <textarea name="codeEditor" value={value} onChange={handleChange} />
      </>
    );
  },
}
));
jest.mock('../../../../PopulateWithPreviewData', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../PopulateWithPreviewData'),
  default: () => <span>Populate with preview data</span>,
}));

let initialStore = getCreatedStore();
const formKey = 'newForm';
const fieldId = 'mockOutput';
const mockOutput = {
  page_of_records: [
    {
      record: {
        id: 'name',
      },
    },
  ],
};
const mockOutputJson = JSON.stringify(mockOutput);

function initMockOutputDrawer(fieldStateProps) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      exports: [
        {
          _id: 'export1',
          adaptorType: 'HTTPExport',
        },
      ],
    };
    draft.session.form = {
      [formKey]: {
        fields: {
          mockOutput: {
            resourceId: 'export1',
            resourceType: 'exports',
            flowId: 'flow1',
            label: 'Mock output',
            helpKey: 'mockOutput',
            type: 'mockoutput',
            fieldId: 'mockOutput',
            id: 'mockOutput',
            name: '/mockOutput',
            defaultValue: '',
            value: mockOutput,
            touched: false,
            visible: true,
            required: false,
            disabled: false,
            options: {},
            isValid: true,
            isDiscretelyInvalid: false,
            errorMessages: '',
            ...fieldStateProps,
          },
        },
      },
    };
  });
  const drawerProviderProps = {
    onClose: jest.fn(),
    height: 'short',
    fullPath: '/',
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/mockOutput/newForm/mockOutput'}]}>
      <Route path="/mockOutput/:formKey/:fieldId" >
        <DrawerProvider {...drawerProviderProps}>
          <MockOutputDrawer />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('MockOutputDrawerContent UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
  test('should initialize all the components correctly on initial render', () => {
    initMockOutputDrawer();

    // Mock output drawer heading
    const label = screen.getByRole('heading', {name: 'Mock output'});

    expect(label).toBeInTheDocument();

    // Populate with preview data button
    expect(screen.getByText('Populate with preview data')).toBeInTheDocument();

    expect(screen.getByText(mockOutputJson)).toBeInTheDocument();

    // done button
    const doneButton = screen.getByRole('button', {name: 'Done'});

    expect(doneButton).toBeInTheDocument();

    expect(doneButton).toBeDisabled();

    // preview panel header
    expect(screen.getByText('Preview data')).toBeInTheDocument();

    // preview panel tabs
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Headers')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });
  test('should display error messages if field state has error messages on initial render', async () => {
    initMockOutputDrawer({errorMessages: 'Mock data should be valid json', value: 'abc'});

    // Mock output drawer heading
    const label = screen.getByRole('heading', {name: 'Mock output'});

    expect(label).toBeInTheDocument();

    // Populate with preview data button
    expect(screen.getByText('Populate with preview data')).toBeInTheDocument();

    expect(screen.getByText('abc')).toBeInTheDocument();

    // done button
    const doneButton = screen.getByRole('button', {name: 'Done'});

    expect(doneButton).toBeInTheDocument();

    expect(doneButton).toBeDisabled();

    expect(screen.getByText('Mock data should be valid json')).toBeInTheDocument();

    // change the editor content to valid json
    const inputNode = document.querySelector('textarea[name="codeEditor"]');

    await userEvent.clear(inputNode);
    inputNode.focus();
    await userEvent.paste(mockOutputJson);
    expect(screen.getByText(mockOutputJson)).toBeInTheDocument();
    expect(screen.queryByText('Mock data should be valid json')).toBeNull();
    expect(doneButton).toBeInTheDocument();

    expect(doneButton).toBeEnabled();
  });
  test('should show error for invalid mock output and done button should be disabled', async () => {
    initMockOutputDrawer();
    const inputNode = document.querySelector('textarea[name="codeEditor"]');

    await userEvent.clear(inputNode);
    await userEvent.type(inputNode, 'userinput');
    expect(screen.getByText(/userinput/i)).toBeInTheDocument();
    expect(screen.getByText(errorMessageStore('MOCK_OUTPUT_INVALID_JSON'))).toBeInTheDocument();
    const doneButton = screen.getByRole('button', {name: 'Done'});

    expect(doneButton).toBeInTheDocument();

    expect(doneButton).toBeDisabled();
  });
  test('should dispatch correct action on click of done button', async () => {
    initMockOutputDrawer();

    // make the editor dirty
    const inputNode = document.querySelector('textarea[name="codeEditor"]');

    await userEvent.clear(inputNode);
    inputNode.focus();
    await userEvent.paste(mockOutputJson);

    const doneButton = screen.getByRole('button', {name: 'Done'});

    expect(doneButton).toBeInTheDocument();
    expect(doneButton).toBeEnabled();
    await userEvent.click(doneButton);
    await waitFor(() => {
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.fieldChange(formKey)(fieldId, mockOutputJson));
    });
  });
});
