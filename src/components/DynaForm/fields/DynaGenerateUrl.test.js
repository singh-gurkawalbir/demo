import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';
import GenerateUrl from './DynaGenerateUrl';

const mockDispatchFn = jest.fn();
const onFieldChange = jest.fn();
const mockFormContext = {
  fields: {
    'webhook.path': {
      id: 'webhook.path',
      isValid: true,
      isDiscretelyInvalid: false,
    },
    'webhook.username': {
      id: 'webhook.username',
      isValid: true,
      isDiscretelyInvalid: false,
    },
    'webhook.password': {
      id: 'webhook.password',
      isValid: true,
      isDiscretelyInvalid: false,
    },
  },
  value: {
    '/name': 'webHK',
    '/webhook/path': '',
    '/webhook/username': 'asdf',
    '/webhook/password': '******',
  },
};

jest.mock('react-copy-to-clipboard', () => ({
  __esModule: true,
  ...jest.requireActual('react-copy-to-clipboard'),
  CopyToClipboard: ({children, onCopy}) => (
    <div onClick={onCopy}>{children}</div>
  ),
}));

jest.mock('../../Form/FormContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../Form/FormContext'),
  default: () => mockFormContext,
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for generate URL field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
    onFieldChange.mockClear();
  });

  test('should not be able to manually edit the URL', async () => {
    const props = {
      resourceId: '626abc',
      resourceType: 'exports',
      onFieldChange,
      type: 'generateurl',
      label: 'Public URL',
      provider: 'custom',
      buttonLabel: 'Generate URL',
      required: true,
      fieldId: 'webhook.url',
      id: 'webhook.url',
      name: '/webhook/url',
      defaultValue: '',
      helpKey: 'export.webhook.url',
      formKey: 'exports-626abc',
      isLoggable: true,
      defaultRequired: true,
      value: 'https://api.staging.integrator.io/v1/exports/626abc/data',
      touched: false,
      visible: true,
      disabled: false,
      options: {
        webHookToken: '',
      },
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
      resourceContext: {
        resourceId: '626abc',
        resourceType: 'exports',
      },
    };

    renderWithProviders(<GenerateUrl {...props} />);
    const label = document.querySelector('label');
    const inputUrlField = screen.getByRole('textbox');
    const copyButton = screen.getByLabelText('Copy to clipboard');

    expect(label).toHaveTextContent(`${props.label} *`);
    expect(inputUrlField).toHaveValue(props.value);
    expect(inputUrlField).toBeDisabled();
    expect(inputUrlField).toBeRequired();

    await userEvent.click(copyButton);
    expect(screen.getByRole('alert')).toHaveTextContent('URL copied to clipboard.');
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'https://api.localhost/v1/exports/626abc/data', true);
  });

  test("should be able to generate URL ( if value doesn't exist )", async () => {
    const props = {
      resourceId: 'new-k65a',
      resourceType: 'exports',
      onFieldChange,
      type: 'generateurl',
      label: 'Public URL',
      provider: 'custom',
      buttonLabel: 'Generate URL',
      required: true,
      fieldId: 'webhook.url',
      id: 'webhook.url',
      name: '/webhook/url',
      helpKey: 'export.webhook.url',
      formKey: 'exports-new-k65a',
      isLoggable: true,
      defaultRequired: true,
      touched: false,
      visible: true,
      disabled: false,
      options: {
        webHookToken: '',
      },
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
      resourceContext: {
        resourceId: 'new-k65a',
        resourceType: 'exports',
      },
    };

    renderWithProviders(<GenerateUrl {...props} />);
    const generateUrlBtn = screen.getAllByRole('button')[1];

    await userEvent.hover(generateUrlBtn);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Generate URL'));

    await userEvent.click(generateUrlBtn);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.submit(
      'exports',
      props.resourceId,
      mockFormContext.value,
      null,
      true,
      false,
      props.flowId
    ));
  });

  test('should not generate URL for a new webhook listener if username, password, or path is invalid', async () => {
    mockFormContext.fields['webhook.username'].isValid = false;
    mockFormContext.fields['webhook.path'].value = 'valid path';
    delete mockFormContext.fields['webhook.password'];
    const props = {
      resourceId: 'new-k65a',
      resourceType: 'exports',
      onFieldChange,
      type: 'generateurl',
      label: 'Public URL',
      provider: 'custom',
      buttonLabel: 'Generate URL',
      required: true,
      fieldId: 'webhook.url',
      id: 'webhook.url',
      name: '/webhook/url',
      helpKey: 'export.webhook.url',
      formKey: 'exports-new-k65a',
      isLoggable: true,
      defaultRequired: true,
      touched: false,
      visible: true,
      disabled: false,
      options: {
        webHookToken: '',
      },
      isValid: true,
      isDiscretelyInvalid: false,
      errorMessages: '',
      resourceContext: {
        resourceId: 'new-k65a',
        resourceType: 'exports',
      },
    };

    renderWithProviders(<GenerateUrl {...props} />);
    const generateUrlBtn = screen.getAllByRole('button')[1];

    await userEvent.click(generateUrlBtn);
    expect(mockDispatchFn).not.toHaveBeenCalled();
    expect(onFieldChange).toHaveBeenCalledWith('webhook.path', 'valid path');
    expect(onFieldChange).toHaveBeenCalledWith('webhook.username', undefined);
    expect(onFieldChange).toHaveBeenCalledWith('webhook.password', '');
  });
});
