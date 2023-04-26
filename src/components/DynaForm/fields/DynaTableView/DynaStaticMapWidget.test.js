import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaStaticMapWidget from './DynaStaticMapWidget';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';

const formKey = 'form_key';
const mockDispatchFn = jest.fn();
const mockOnFieldChange = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
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

const initialStore = reduxStore;

function initDynaStaticMapWidget(props = {}) {
  const ui = (
    <DynaStaticMapWidget {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('DynaStaticMapWidget UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test static mapping refresh buttons and selecting fail record radio button in action to take if unique match not found radio options and also handling the cleanup', async () => {
    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someIntegrationId: {
          someId: {
            isLoading: false,
            shouldReset: false,
            data: {optionsMap: [{id: 'extracts', label: 'extract header', options: undefined, readOnly: false, required: true, type: 'input', multiline: false, supportsRefresh: true}, {id: 'generates', label: 'generate header', options: undefined, readOnly: false, required: true, type: 'input', multiline: false, supportsRefresh: true}],
            },
            fieldType: 'somefieldtype',
          },
        },
      };
      draft.session.form[formKey] = {
        showValidationBeforeTouched: true,
      };
    });
    const props = {
      id: 'someId',
      _integrationId: 'someIntegrationId',
      extracts: ['name', 'id'],
      map: {name: 'samplename', id: 'Id'},
      defaultValue: 'defaultValue',
      onFieldChange: mockOnFieldChange,
      hideLookupAllowFailures: false,
      generates: ['samplename', 'Id'],
      extractFieldHeader: 'extract header',
      generateFieldHeader: 'generate header',
      supportsExtractsRefresh: true,
      supportsGeneratesRefresh: true,
      isLoggable: true,
      allowFailures: true,
      formKey,
    };
    const { utils: { unmount } } = initDynaStaticMapWidget(props);

    expect(screen.getByText('extract header')).toBeInTheDocument();
    expect(screen.getByText('generate header')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {allowFailures: true, default: 'defaultValue', map: {id: 'Id', name: 'samplename'}}, true);
    // screen.debug(null, Infinity);
    await userEvent.click(document.querySelector('.makeStyles-refreshIcon-14'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.refreshMetadata('extracts', 'someId', 'someIntegrationId'));
    expect(screen.getByLabelText('Action to take if unique match not found')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('radio')[0]);
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: { name: 'samplename', id: 'Id' },
      default: undefined,
      allowFailures: false,
    });

    const inputs = screen.getAllByRole('combobox');

    await fireEvent.change(inputs[0], { target: { value: '' } });
    await userEvent.type(inputs[0], 'Typechanged');
    expect(screen.getByDisplayValue('Typechanged')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: { Typechanged: 'samplename', id: 'Id' },
      default: 'defaultValue',
      allowFailures: false,
    });
    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.clearMetadata('someId', 'someIntegrationId'));
  });
  test('should test static mapping refresh buttons and selecting use null as default value radio button in action to take if unique match not found radio options', async () => {
    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someIntegrationId: {
          someId: {
            isLoading: false,
            shouldReset: false,
            data: {generates: [{id: 'extracts', text: 'extract header'}], extracts: [{id: 'generates', label: 'generate header'}]},
            fieldType: 'somefieldtype',
          },
        },
      };
      draft.session.form[formKey] = {
        showValidationBeforeTouched: true,
      };
    });
    const props = {
      id: 'someId',
      _integrationId: 'someIntegrationId',
      defaultValue: '',
      onFieldChange: mockOnFieldChange,
      hideLookupAllowFailures: false,
      extractFieldHeader: 'extract header',
      generateFieldHeader: 'generate header',
      supportsExtractsRefresh: true,
      supportsGeneratesRefresh: true,
      isLoggable: true,
      allowFailures: true,
      formKey,
    };

    initDynaStaticMapWidget(props);

    expect(screen.getByText('extract header')).toBeInTheDocument();
    expect(screen.getByText('generate header')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {allowFailures: true, default: '', map: {}}, true);
    expect(screen.getByLabelText('Action to take if unique match not found')).toBeInTheDocument();
    const radiobutton = document.querySelectorAll('input[type="radio"]');

    await userEvent.click(radiobutton[2]);
    expect(radiobutton[2]).toBeChecked();
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: {},
      default: '',
      allowFailures: true,
    }, true);
  });

  test('should test static mapping refresh buttons and selecting empty string as default value radio button in action to take if unique match not found radio options', async () => {
    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someIntegrationId: {
          someId: {
            isLoading: false,
            shouldReset: false,
            data: {},
            fieldType: 'somefieldtype',
          },
        },
      };
      draft.session.form[formKey] = {
        showValidationBeforeTouched: true,
      };
    });
    const props = {
      id: 'someId',
      _integrationId: 'someIntegrationId',
      defaultValue: null,
      onFieldChange: mockOnFieldChange,
      hideLookupAllowFailures: false,
      extractFieldHeader: 'extract header',
      generateFieldHeader: 'generate header',
      supportsExtractsRefresh: true,
      supportsGeneratesRefresh: true,
      isLoggable: true,
      allowFailures: true,
      formKey,
    };
    const { utils: { unmount } } = initDynaStaticMapWidget(props);

    expect(screen.getByText('extract header')).toBeInTheDocument();
    expect(screen.getByText('generate header')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {allowFailures: true, default: null, map: {}}, true);
    expect(screen.getByLabelText('Action to take if unique match not found')).toBeInTheDocument();
    const radiobutton = document.querySelectorAll('input[type="radio"]');

    await userEvent.click(radiobutton[1]);
    expect(radiobutton[1]).toBeChecked();
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: {},
      default: null,
      allowFailures: true,
    }, true);

    const inputs = screen.getAllByRole('combobox');

    await userEvent.type(inputs[0], 'RandomText');
    expect(screen.getByDisplayValue('RandomText')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: {},
      default: null,
      allowFailures: true,
    });

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.connectors.clearMetadata('someId', 'someIntegrationId'));
  });
  test('should test perform mapping dropdown', async () => {
    mutateStore(initialStore, draft => {
      draft.session.connectors = {
        someIntegrationId: {
          someId: {
            isLoading: false,
            shouldReset: false,
            data: {generates: [{text: 'exportop1', id: 'op1'}, {text: 'exportop2', id: 'op2'}],
            },
            fieldType: 'somefieldtype',
          },
        },
      };
      draft.session.form[formKey] = {
        showValidationBeforeTouched: true,
      };
    });
    const props = {
      id: 'someId',
      _integrationId: 'someIntegrationId',
      extracts: ['name', 'id'],
      map: {name: 'samplename', id: 'Id'},
      defaultValue: 'defaultValue',
      onFieldChange: mockOnFieldChange,
      hideLookupAllowFailures: false,
      generates: ['samplename', 'Id'],
      extractFieldHeader: 'extract header',
      generateFieldHeader: 'generate header',
      supportsExtractsRefresh: true,
      supportsGeneratesRefresh: true,
      isLoggable: true,
      allowFailures: true,
      formKey,
    };

    initDynaStaticMapWidget(props);

    expect(screen.getByText('extract header')).toBeInTheDocument();
    expect(screen.getByText('generate header')).toBeInTheDocument();
    expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('samplename')).toBeInTheDocument();
    expect(screen.getByDisplayValue('id')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Id')).toBeInTheDocument();
    expect(mockOnFieldChange).toBeCalledWith('someId', {allowFailures: true, default: 'defaultValue', map: {id: 'Id', name: 'samplename'}}, true);
    expect(screen.getByLabelText('Action to take if unique match not found')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button')[2]);
    const menuItems = screen.getAllByRole('menuitem');
    const items = menuItems.map(each => each.textContent);

    expect(items).toEqual(
      [
        'Please select',
        'exportop1',
        'exportop2',
      ]
    );
    await userEvent.click(screen.getAllByRole('menuitem')[0]);
    expect(mockOnFieldChange).toBeCalledWith('someId', {
      map: { name: 'samplename', id: 'Id' },
      default: '',
      allowFailures: true,
    });
  });
});
