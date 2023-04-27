
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import TokenGenerator from './index';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initTokenGenerator(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.connectionToken = {
      '5b3c75dd5d3c125c88b5dd20': {
        fieldsToBeSetWithValues: {
          field1: 1,
          field2: 2,
        },
        status: props.status,
        message: props.message,
      },
    };
    draft.session.form = {
      formKey: {
        fields: [{id: 'fieldId1', value: 'value', touched: true}, {id: 'fieldId2', value: 'value2'}],
        value: 'formValue',
      },
    };
  });

  return renderWithProviders(<TokenGenerator {...props} />, {initialStore});
}

describe('tokenGenerator UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    onFieldChange: mockonFieldChange,
    id: 'testId',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    inputboxLabel: 'input label',
    label: 'test label',
    formKey: 'formKey',
  };

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

  test('should pass the initial render', () => {
    initTokenGenerator(props);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'test label'})).toBeInTheDocument();
  });
  test('should run the onFieldChange function passed in props 4 times on initial render', async () => {
    initTokenGenerator(props);
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalledTimes(4));
  });
  test('should make a dispatch call on initial render', async () => {
    initTokenGenerator(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.connections.clearToken('5b3c75dd5d3c125c88b5dd20')));
  });
  test('should display an error message when connectionToken has message prop', async () => {
    initTokenGenerator({...props, message: 'test error message'});
    await waitFor(() => expect(screen.getByText('test error message')).toBeInTheDocument());
  });
  test('should make a dispatch call when clicked on connectionToken label', async () => {
    initTokenGenerator({...props});
    await waitFor(() => expect(screen.getByText('test label')).toBeInTheDocument());
    await userEvent.click(screen.getByText('test label'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.connections.requestToken('5b3c75dd5d3c125c88b5dd20', 'testId', 'formValue')));
  });
});
