
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import DynaSQLQueryBuildersafe from './index';
import { renderWithProviders } from '../../../../test/test-utils';
import actions from '../../../../actions';
import { EXPORT_FILTERED_DATA_STAGE } from '../../../../utils/flowData';

const mockonFieldChange = jest.fn();
let mockSave = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const mockDispatchFn = jest.fn(action => {
  switch (action.type) {
    case 'EDITOR_INIT':
      mockSave = action.options.onSave;
      break;
    default:
  }
});

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

function initDynaSQLQueryBuildersafe(props = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949'}]}>
      <Route
        path="/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/">
        <DynaSQLQueryBuildersafe {...props} />
        <button type="button" onClick={() => mockSave({rule: 'SampleRule', supportsDefaultData: 'supportsDefaultData'})}>Save</button>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('dynaSQLQueryBuilder_afe UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should open the AFE editor on clicking handlebar Icon for resource type as exports', async () => {
    const props = {
      id: 'rdbms.query',
      label: 'SQL query',
      resourceId: '6340b7b746048c3afbacb178',
      resourceType: 'exports',
      flowId: '63947b4ffc58924d43aec619',
      formKey: 'exports-6340b7b746048c3afbacb178',
      onFieldChange: mockonFieldChange,
      arrayIndex: 0,
      value: ['somevalue'],
    };

    initDynaSQLQueryBuildersafe(props);
    const label = document.querySelector('label');

    expect(label).toHaveTextContent(props.label);
    const userButton = document.querySelector('[data-test="rdbms.query"]');

    await userEvent.click(userButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.editor.init('rdbmsquery', 'sql', {
      formKey: 'exports-6340b7b746048c3afbacb178',
      flowId: '63947b4ffc58924d43aec619',
      resourceId: '6340b7b746048c3afbacb178',
      resourceType: 'exports',
      fieldId: props.id,
      stage: EXPORT_FILTERED_DATA_STAGE,
      onSave: expect.anything(),
    }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/editor/rdbmsquery');
  });

  test('should be able to save the modified code in AFE provided no default data', async () => {
    const props = {
      id: 'rdbms.query',
      label: 'SQL query',
      resourceId: '6340b7b746048c3afbacb178',
      resourceType: 'exports',
      flowId: '63947b4ffc58924d43aec619',
      formKey: 'exports-6340b7b746048c3afbacb178',
      onFieldChange: mockonFieldChange,
      arrayIndex: 0,
      value: ['somevalue'],
    };

    initDynaSQLQueryBuildersafe(props);
    const userButton = document.querySelector('[data-test="rdbms.query"]');

    await userEvent.click(userButton);
    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(mockonFieldChange).toHaveBeenCalledWith('modelMetadata', {});
    expect(mockonFieldChange).toHaveBeenCalledWith('rdbms.query', ['SampleRule']);
  });
  test('should be able to save the modified code in AFE when default data is provided', async () => {
    const props = {
      id: 'rdbms.query',
      label: 'SQL query',
      resourceId: '6340b7b746048c3afbacb178',
      resourceType: 'exports',
      flowId: '63947b4ffc58924d43aec619',
      formKey: 'exports-6340b7b746048c3afbacb178',
      onFieldChange: mockonFieldChange,
      arrayIndex: 0,
      value: 'somevalue',
    };

    renderWithProviders(
      <MemoryRouter
        initialEntries={[{pathname: '/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949'}]}>
        <Route
          path="/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/">
          <DynaSQLQueryBuildersafe {...props} />
          <button type="button" onClick={() => mockSave({rule: 'SampleRule', defaultData: '{"result":true, "count":42}', supportsDefaultData: 'supportsDefaultData'})}>Save</button>
        </Route>
      </MemoryRouter>);
    const userButton = document.querySelector('[data-test="rdbms.query"]');

    await userEvent.click(userButton);
    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(mockonFieldChange).toHaveBeenCalledWith('modelMetadata', { result: true, count: 42 });
    expect(mockonFieldChange).toHaveBeenCalledWith('rdbms.query', 'SampleRule');
  });

  test('should be able to save the modified code in AFE provided no support default data', async () => {
    const props = {
      id: 'rdbms.query',
      label: 'SQL query',
      resourceId: '6340b7b746048c3afbacb178',
      resourceType: 'exports',
      flowId: '63947b4ffc58924d43aec619',
      formKey: 'exports-6340b7b746048c3afbacb178',
      onFieldChange: mockonFieldChange,
      arrayIndex: 0,
      value: 'somevalue',
    };

    renderWithProviders(
      <MemoryRouter
        initialEntries={[{pathname: '/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949'}]}>
        <Route
          path="/integrations/6387a6877045c4017f06f9d3/flowBuilder/63947b4ffc58924d43aec619/edit/imports/6368996d667fdb7984b49949/">
          <DynaSQLQueryBuildersafe {...props} />
          <button type="button" onClick={() => mockSave({rule: 'SampleRule'})}>Save</button>
        </Route>
      </MemoryRouter>);
    const userButton = document.querySelector('[data-test="rdbms.query"]');

    await userEvent.click(userButton);
    const saveBtn = screen.getByRole('button', {name: /save/i});

    await userEvent.click(saveBtn);
    expect(mockonFieldChange).toHaveBeenCalledWith('rdbms.query', 'SampleRule');
  });
});
