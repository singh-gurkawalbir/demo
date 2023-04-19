
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../test/test-utils';
import scheduleAction from './schedule';
import * as cancelContext from '../../../../components/FormOnCancelContext';

jest.mock('../../../../components/FlowSchedule', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/FlowSchedule'),
  default: props => {
    const formKey = `formKey: ${props.formKey}`;
    const pgexportId = `pgexportId: ${props.pg._exportId}`;
    const disabled = props.disabled ? 'disabled : true' : 'disabled : false';
    const index = `index: ${props.index}`;

    return (
      <>
        <div>FlowSchedule</div>
        <div>{formKey}</div>
        <div>{pgexportId}</div>
        <div>{disabled}</div>
        <div>{index}</div>
        <div>{props.flow.name}</div>
      </>
    );
  },
}));

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

const resource = {_id: 'resourceId'};

describe('scheduleAction UI tests', () => {
  async function initStoreAndRender() {
    const initialStore = reduxStore;

    mutateStore(initialStore, draft => {
      draft.data.resources.flows = [{
        _id: '5ea16c600e2fab71928a6155',
        name: 'Name of the flow',
      }];
    });

    const {Component} = scheduleAction;

    renderWithProviders(
      <Component
        open
        flowId="5ea16c600e2fab71928a6155"
        isViewMode
        resource={resource}
        index={1}
        />, {initialStore});
  }
  test('should test name, position and helpKey', () => {
    const {helpKey, name, position} = scheduleAction;

    expect(name).toBe('exportSchedule');
    expect(position).toBe('middle');
    expect(helpKey).toBe('fb.pg.exports.schedule');
  });
  test('should test the schedule dialog component', async () => {
    await initStoreAndRender();

    expect(screen.getByText('Flow schedule override')).toBeInTheDocument();
    expect(screen.getByText('FlowSchedule')).toBeInTheDocument();
    expect(screen.getByText('formKey: flow-schedule')).toBeInTheDocument();
    expect(screen.getByText('pgexportId: resourceId')).toBeInTheDocument();
    expect(screen.getByText('disabled : true')).toBeInTheDocument();
    expect(screen.getByText('index: 1')).toBeInTheDocument();
    expect(screen.getByText('Name of the flow')).toBeInTheDocument();
  });
  test('should test the onclose modal component function', async () => {
    const mockSetCancelTriggered = jest.fn();

    jest.spyOn(cancelContext, 'default').mockReturnValue({disabled: false, setCancelTriggered: mockSetCancelTriggered});
    await initStoreAndRender();
    let button;

    waitFor(() => { button = screen.getByRole('button'); });

    waitFor(async () => {
      await userEvent.click(button);

      expect(mockSetCancelTriggered).toHaveBeenCalled();
    });
  });
});
