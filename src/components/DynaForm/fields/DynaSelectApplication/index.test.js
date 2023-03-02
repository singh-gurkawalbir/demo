import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SelectApplication from '.';
import { renderWithProviders } from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import * as newId from '../../../../utils/resource';
import * as FormContext from '../../../Form/FormContext';
import actions from '../../../../actions';

let initialStore;
const mockOnFieldChange = jest.fn();

function initSelectApplication({props}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test/add'}]}
    >
      <Route
        path="/test/:operation"
        params={{operation: 'add'}}
      >
        <SelectApplication {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../FieldMessage', () => ({
  __esModule: true,
  ...jest.requireActual('../FieldMessage'),
  default: () => (
    <div>
      Mock Field Message
    </div>
  ),
}));
jest.mock('../../FieldHelp', () => ({
  __esModule: true,
  ...jest.requireActual('../../FieldHelp'),
  default: () => (
    <div>
      Mock Field Help
    </div>
  ),
}));
jest.mock('../../../icons/SearchIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/SearchIcon'),
  default: () => (
    <div>
      Mock Search Icon
    </div>
  ),
}));
jest.mock('../../../../constants/applications', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../constants/applications'),
  applicationsList: () => ([{id: 'test_groupapp_id', name: 'Test Group App'}]),
  groupApplications: () => ([{label: 'test_label', connectors: [{id: 'test_groupapp_id', name: 'Test Group App', type: 'testgroupapp', keywords: 'database,db', group: 'db', helpURL: 'https://test'}]}]),
}));
jest.mock('../../../icons/ApplicationImg', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/ApplicationImg'),
  default: props => (
    <div>
      Mock Application Image
      <div>markOnly = {props.markOnly}</div>
      <div>type = {props.type}</div>
      <div>assistant = {props.assistant}</div>
    </div>
  ),
}));
jest.mock('./AppPill', () => ({
  __esModule: true,
  ...jest.requireActual('./AppPill'),
  default: props => (
    <div>
      Mock App AppPill
      <div>key = {props.key}</div>
      <div>appId = {props.appId}</div>
      <div>onRemove = {props.onRemove}</div>
    </div>
  ),
}));
describe('Testsuite for SelectApplications', () => {
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
    mockOnFieldChange.mockClear();
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should test the disabled select application', () => {
    const props = {
      disabled: true,
      appType: 'testAppType',
      id: 'test_id',
      isMulti: true,
      name: 'Test Name',
      options: {appType: 'test_apptype'},
      label: 'Test Label',
      flowId: 'test_flow_id',
      resourceType: 'test resource type',
      resourceId: 'test_resource_id',
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      formKey: 'form_key',
    };

    initSelectApplication({props});
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label').className).toEqual(expect.stringContaining('Mui-disabled'));
  });
  test('should test the select application label when enabled', () => {
    const props = {
      disabled: false,
      appType: 'testAppType',
      id: 'test_id',
      isMulti: true,
      name: 'Test Name',
      options: {appType: 'test_apptype'},
      label: 'Test Label',
      flowId: 'test_flow_id',
      resourceType: 'test resource type',
      resourceId: 'test_resource_id',
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      formKey: 'form_key',
    };

    initSelectApplication({props});
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label').className).not.toEqual(expect.stringContaining('Mui-disabled'));
  });
  test('should test the search icon and the options like application image when rendering select application', () => {
    const props = {
      disabled: false,
      appType: 'testAppType',
      id: 'test_id',
      isMulti: true,
      name: 'Test Name',
      options: {appType: 'test_apptype'},
      label: 'Test Label',
      flowId: 'test_flow_id',
      resourceType: 'test resource type',
      resourceId: 'test_resource_id',
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      formKey: 'form_key',
    };

    initSelectApplication({props});
    expect(screen.getByText(/Mock Search Icon/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock Application Image/i)).toBeInTheDocument();
    expect(screen.getByText(/markOnly =/i)).toBeInTheDocument();
    expect(screen.getByText(/type = testgroupapp/i)).toBeInTheDocument();
    expect(screen.getByText(/assistant =/i)).toBeInTheDocument();
  });
  test('should test the select application by searching an app and by selecting it', async () => {
    jest.spyOn(newId, 'isNewId').mockReturnValue(true);
    jest.spyOn(FormContext, 'default').mockReturnValue({fieldMeta: {fieldMap: [{id: 'test_id'}]}});
    const props = {
      disabled: false,
      appType: 'testAppType',
      id: 'test_id',
      isMulti: false,
      name: 'Test Name',
      options: {appType: 'test_apptype'},
      label: 'Test Label',
      flowId: 'test_flow_id',
      resourceType: 'connections',
      resourceId: 'test_resource_id',
      placeholder: 'test_placeholder',
      onFieldChange: mockOnFieldChange,
      isLoggable: true,
      formKey: 'form_key',
    };

    initSelectApplication({props});
    waitFor(async () => {
      const textBox = screen.getByRole('textbox');

      expect(textBox).toBeInTheDocument();
      expect(document.querySelector('input').getAttribute('value')).toBe('');
      await userEvent.type(textBox, 'test');
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(document.querySelector('input').getAttribute('value')).toBe('test');
      expect(screen.getByText(/test_label/i)).toBeInTheDocument();
      await userEvent.click(screen.getByText('Test Group App'));
      expect(screen.queryByText(/test_label/i)).not.toBeInTheDocument();
      expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.submit('connections', 'test_resource_id', {name: 'Test Group App', test_id: 'test_groupapp_id'}, {
        isExact: true,
        params: {
          operation: 'add',
        },
        path: '/test/:operation',
        url: '/test/add',
      }, false, false, 'test_flow_id'));
    });
  });
});
