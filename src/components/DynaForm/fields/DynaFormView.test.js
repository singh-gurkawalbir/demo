/* eslint-disable jest/expect-expect */

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import FormView from './DynaFormView';

const onFieldChange = jest.fn();

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

const props = { resourceType: 'imports', id: 'id', label: 'FieldLabel', resourceId: 'imp1', formKey: '_formKey', value: {}, flowId: 'flow1' };

async function initFormView(props) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.form = {
      _formKey: {
        value: {},
        fields: {
          a: {touched: true, id: 'a', value: 'a'},
        },
      },
    };
    draft.data.resources = {
      imports: [
        {
          _id: 'imp1',
          _connectionId: 'conn1',
          adapterType: 'HTTPImport',
          assistant: 'zendesk',
          http: { mediaType: 'json', type: 'GET' },
        },
        {
          _id: 'imp2',
          _connectionId: 'conn2',
          assistant: 'graphql',
        },
        {
          _id: 'imp3',
          _connectionId: 'conn3',
          assistant: 'acumaticaecommerce',
        },
      ],
      connections: [
        {
          _id: 'conn1',
          http: { _httpConnectorId: 'httpConn1' },
          assistant: 'googledrive',
        },
        {
          _id: 'conn2',
          http: { formType: 'graph_ql' },
          assistant: 'graphql',
        },
        {
          _id: 'conn3',
          http: { _httpConnectorId: 'httpConn1' },
          assistant: 'acumaticaecommerce',
        },
      ],
    };
  });

  return renderWithProviders(<FormView {...props} />, { initialStore });
}

describe('formView tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
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
    onFieldChange.mockClear();
  });
  test('should able to test FormView with googledrive Assistant type http', async () => {
    await initFormView(props);
    expect(screen.getByText('FieldLabel')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', { name: 'Please select' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', { name: 'Google Drive' }));
    expect(mockDispatchFn).toHaveBeenCalled();
  });
  test('should able to test FormView with acumaticaecommerce Assistant type rest', async () => {
    await initFormView({...props, resourceId: 'imp3'});
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'REST API' }));
  });
  test('should able to test FormView with graph_ql', async () => {
    await initFormView({...props, resourceId: 'imp2'});
    expect(screen.getByText('FieldLabel')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'HTTP' }));
    expect(mockDispatchFn).not.toHaveBeenCalledWith();
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('menuitem', { name: 'GraphQL' }));
  });
  test('should able to test FormView with invalid resource', async () => {
    await initFormView({ ...props, resourceId: undefined, resourceType: 'something' });
    expect(screen.queryByText('FieldLabel')).not.toBeInTheDocument();
  });
});
