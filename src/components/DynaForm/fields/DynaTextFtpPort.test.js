
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import DynaTextFtpPort from './DynaTextFtpPort';

jest.mock('../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldHelp'),
  default: () => (<span data-testid="fieldHelp">?</span>),
}));

describe('test suite for Port field in FTP connection', () => {
  test('should populate the saved values', () => {
    const onFieldChange = jest.fn();
    const props = {
      formKey: 'connections-62fb3e595ebfa623b56565c3',
      errorMessages: '',
      id: 'ftp.port',
      isValid: true,
      name: '/ftp/port',
      onFieldChange,
      value: 22,
      label: 'Port',
      options: 22,
      disabled: false,
      resourceType: 'connections',
      resourceId: '6261ab',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          'ftp.type': {
            resourceId: props.resourceId,
            resourceType: props.resourceType,
            id: 'ftp.type',
            value: 'sftp',
          },
        },
      };
    });
    renderWithProviders(<DynaTextFtpPort {...props} />, {initialStore});
    expect(screen.getByTestId('fieldHelp')).toBeInTheDocument();

    const label = document.querySelector('label');
    const inputField = screen.getByRole('textbox');

    expect(label).toHaveTextContent(props.label);
    expect(inputField).toHaveValue(props.value.toString());

    expect(onFieldChange).toHaveBeenCalledWith(props.id, props.options, true);
  });

  test('should respond to change in value', async () => {
    const onFieldChange = jest.fn();
    const props = {
      formKey: 'connections-62fb3e595ebfa623b56565c3',
      errorMessages: '',
      id: 'ftp.port',
      isValid: true,
      name: '/ftp/port',
      onFieldChange,
      placeholder: 'Enter port number',
      label: 'Port',
      options: 22,
      disabled: false,
      resourceType: 'connections',
      resourceId: '6261ab',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          'ftp.type': {
            resourceId: props.resourceId,
            resourceType: props.resourceType,
            id: 'ftp.type',
            value: 'sftp',
          },
        },
      };
    });
    renderWithProviders(<DynaTextFtpPort {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, props.options, true);
    const inputField = screen.getByRole('textbox');

    expect(inputField).toHaveAttribute('placeholder', props.placeholder);

    await userEvent.type(inputField, '8080');

    let currVal = '';

    '8080'.split('').forEach(char => {
      currVal += char;
      expect(onFieldChange).toHaveBeenCalledWith(props.id, currVal);
    });
  });

  test('should show the error message if invalid value is entered', () => {
    const onFieldChange = jest.fn();
    const props = {
      formKey: 'connections-62fb3e595ebfa623b56565c3',
      errorMessages: 'Must be a number',
      id: 'ftp.port',
      isValid: false,
      name: '/ftp/port',
      onFieldChange,
      value: '22h',
      label: 'Port',
      options: 22,
      disabled: false,
      resourceType: 'connections',
      resourceId: '6261ab',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          'ftp.type': {
            resourceId: props.resourceId,
            resourceType: props.resourceType,
            id: 'ftp.type',
            value: 'sftp',
          },
        },
      };
    });
    renderWithProviders(<DynaTextFtpPort {...props} />, {initialStore});

    expect(onFieldChange).not.toHaveBeenCalled();
    expect(screen.getByText(props.errorMessages)).toBeInTheDocument();
  });

  test('shoukd not be able to modify the input field if disabled', () => {
    const onFieldChange = jest.fn();
    const props = {
      formKey: 'connections-62fb3e595ebfa623b56565c3',
      errorMessages: '',
      id: 'ftp.port',
      isValid: true,
      name: '/ftp/port',
      onFieldChange,
      label: 'Port',
      options: 22,
      disabled: true,
      resourceType: 'connections',
      resourceId: '6261ab',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.form[props.formKey] = {
        fields: {
          'ftp.type': {
            resourceId: props.resourceId,
            resourceType: props.resourceType,
            id: 'ftp.type',
            value: 'sftp',
          },
        },
      };
    });
    renderWithProviders(<DynaTextFtpPort {...props} />, {initialStore});

    const inputField = screen.getByRole('textbox');

    expect(inputField).toBeDisabled();
  });
});
