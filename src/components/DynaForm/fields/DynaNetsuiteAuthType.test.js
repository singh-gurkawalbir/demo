/* global describe, jest, expect, test */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaNetsuiteAuthType from './DynaNetsuiteAuthType';

let mockWsdlVersion;

jest.mock('../../Form/FormContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../Form/FormContext'),
  default: () => ({
    value: {
      '/netsuite/wsdlVersion': mockWsdlVersion,
    },
  }),
}));

describe('test suite for DynaNetsuiteAuthType field', () => {
  test('should not show basic option for version 2020.2', () => {
    mockWsdlVersion = '2020.2';
    const props = {
      resourceId: 'new-_20KI3tVF3',
      formKey: 'connections-new-_20KI3tVF3',
      name: '/netsuite/authType',
      resourceType: 'connections',
      id: 'netsuite.authType',
      label: 'Authentication type',
      type: 'nsauthtype',
      required: true,
    };

    renderWithProviders(<DynaNetsuiteAuthType {...props} />);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(`${props.label} *`);
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const options = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(options).toEqual([
      'Please select...',
      'Token Based Auth (Automatic)...',
      'Token Based Auth (Manual)...',
    ]);
  });

  test('should show basic option for versions below 2020.2', () => {
    mockWsdlVersion = '2018.1';
    const props = {
      resourceId: 'new-_20KI3tVF3',
      formKey: 'connections-new-_20KI3tVF3',
      name: '/netsuite/authType',
      resourceType: 'connections',
      id: 'netsuite.authType',
      label: 'Authentication type',
      type: 'nsauthtype',
      required: true,
    };

    renderWithProviders(<DynaNetsuiteAuthType {...props} />);
    userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    const options = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(options).toEqual([
      'Please select...',
      'Basic (To be deprecated - Do not use)...',
      'Token Based Auth (Automatic)...',
      'Token Based Auth (Manual)...',
    ]);
  });

  test('should reset the value if authentication type is basic with version 2020.2', () => {
    mockWsdlVersion = '2020.2';
    const onFieldChange = jest.fn();
    const props = {
      resourceId: 'new-_20KI3tVF3',
      formKey: 'connections-new-_20KI3tVF3',
      name: '/netsuite/authType',
      resourceType: 'connections',
      value: 'basic',
      id: 'netsuite.authType',
      label: 'Authentication type',
      type: 'nsauthtype',
      onFieldChange,
      required: true,
    };

    renderWithProviders(<DynaNetsuiteAuthType {...props} />);
    expect(onFieldChange).toBeCalledWith(props.id, '');
  });

  test('should refresh the available authentication types on changing wsdl version', () => {
    mockWsdlVersion = '2016.2';
    const onFieldChange = jest.fn();
    const props = {
      resourceId: 'new-_20KI3tVF3',
      formKey: 'connections-new-_20KI3tVF3',
      name: '/netsuite/authType',
      resourceType: 'connections',
      id: 'netsuite.authType',
      value: 'basic',
      label: 'Authentication type',
      type: 'nsauthtype',
      onFieldChange,
      required: true,
    };

    const {utils: {rerender: renderFun}} = renderWithProviders(<DynaNetsuiteAuthType {...props} />);

    expect(onFieldChange).not.toBeCalled();
    const selectedAuthType = screen.getByRole('button');

    expect(selectedAuthType).toHaveTextContent('Basic (To be deprecated - Do not use)');
    expect(document.querySelector('input')).toHaveValue('basic');
    userEvent.click(selectedAuthType);
    const options = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(options).toEqual([
      'Please select...',
      'Basic (To be deprecated - Do not use)...',
      'Token Based Auth (Automatic)...',
      'Token Based Auth (Manual)...',
    ]);
    userEvent.click(screen.getByRole('menuitem', {name: 'Token Based Auth (Manual)'}));
    expect(onFieldChange).toBeCalledWith(props.id, 'token');

    mockWsdlVersion = '2020.2';
    renderWithProviders(<DynaNetsuiteAuthType {...props} />, {renderFun});
    expect(onFieldChange).toBeCalledWith(props.id, '');

    userEvent.click(screen.getByRole('button'));
    const newOptions = screen.getAllByRole('menuitem').map(ele => ele.textContent);

    expect(newOptions).toEqual([
      'Please select...',
      'Token Based Auth (Automatic)...',
      'Token Based Auth (Manual)...',
    ]);
  });
});
