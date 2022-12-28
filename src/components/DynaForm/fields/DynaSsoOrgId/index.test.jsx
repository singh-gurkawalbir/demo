
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import DynaSsoOrgId from './index';
import actions from '../../../../actions';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

const initialStore = reduxStore;
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initDynaSsoOrgId(props = {}) {
  const ui = (
    <DynaSsoOrgId {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaSsoOrgId UI test cases', () => {
  test('should make dispatch calls when status is set to requested', () => {
    const data = {
      description: 'somedescription',
      errorMessages: 'someerrormessages',
      isValid: true,
      id: 'someid',
      formKey: 'formkey',
      touched: true,
      value: 'somevalue',
    };

    initialStore.getState().session.sso = {
      status: 'requested',
    };
    initDynaSsoOrgId(data);
    expect(mockDispatch).toHaveBeenCalledWith(actions.sso.validateOrgId('somevalue'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.form.forceFieldState('formkey')('someid', {isValid: false}));
    expect(screen.getByText('Verifying...')).toBeInTheDocument();
  });
  test('should make dispatch call when status is set to error', () => {
    const data =
    {
      description: 'somedescription',
      errorMessages: 'someerrormessages',
      isValid: true,
      id: 'someid',
      formKey: 'formkey',
      touched: false,
      value: 'somevalue',
    };

    initialStore.getState().session.sso = {
      status: 'error',
      error: 'invalid sso org id',
    };
    initDynaSsoOrgId(data);
    expect(mockDispatch).toHaveBeenCalledWith(actions.form.forceFieldState('formkey')('someid', {isValid: false, errorMessages: 'invalid sso org id' }));
    expect(screen.getByText('someerrormessages')).toBeInTheDocument();
  });

  test('should make dispatch call when error is provided and no value provided', () => {
    const data =
    {
      description: 'somedescription',
      errorMessages: 'someerrormessages',
      id: 'someid',
      formKey: 'formkey',
      touched: true,
    };

    initialStore.getState().session.sso = {
      status: 'error',
      error: 'invalid sso org id',
    };
    initDynaSsoOrgId(data);
    expect(mockDispatch).toHaveBeenCalledWith(actions.sso.validateOrgId(undefined));
    expect(mockDispatch).toHaveBeenCalledWith(actions.form.forceFieldState('formkey')('someid', {isValid: false, errorMessages: 'A value must be provided'}));
    expect(screen.getByText('someerrormessages')).toBeInTheDocument();
  });
  test('should make dispatch calls when error, value is provided', () => {
    const data =
    {
      description: 'somedescription',
      errorMessages: 'someerrormessages',
      id: 'someid',
      formKey: 'formkey',
      touched: true,
      value: 'somevalue',
    };

    initialStore.getState().session.sso = {
      status: 'error',
      error: 'invalid sso org id',
    };
    initDynaSsoOrgId(data);
    expect(mockDispatch).toHaveBeenCalledWith(actions.sso.validateOrgId('somevalue'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.form.forceFieldState('formkey')('someid', {isValid: false, errorMessages: 'invalid sso org id' }));
  });

  test('should make dispatch call when status is set to success and no value provided', () => {
    const data =
    {
      description: 'somedescription',
      errorMessages: 'someerrormessages',
      id: 'someid',
      formKey: 'formkey',
    };

    initialStore.getState().session.sso = {
      status: 'success',
    };
    initDynaSsoOrgId(data);
    expect(mockDispatch).toHaveBeenCalledWith(actions.form.forceFieldState('formkey')('someid', {isValid: true}));
  });
});
