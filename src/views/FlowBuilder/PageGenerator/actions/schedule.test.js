/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
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

const flows = [{
  _id: '5ea16c600e2fab71928a6152',
  lastModified: '2021-08-13T08:02:49.712Z',
  name: 'Name of the flow',
  disabled: true,
  _integrationId: '5ff579d745ceef7dcd797c15',
  skipRetries: false,
  pageProcessors: [
    {
      responseMapping: {
        fields: [],
        lists: [],
      },
      type: 'import',
      _importId: '5ac5e4d706bd2615df9fba44',
    },
  ],
  pageGenerators: [
    {
      _exportId: '5d00b9f0bcd64414811b2396',
    },
  ],
  createdAt: '2020-04-23T10:22:24.290Z',
  lastExecutedAt: '2020-04-23T11:08:41.093Z',
  autoResolveMatchingTraceKeys: true,
}];

const resource = {_id: 'resourceId'};

describe('scheduleAction UI tests', () => {
  function initStoreAndRender() {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.flows = flows;

    const {Component} = scheduleAction;

    renderWithProviders(
      <Component
        open
        flowId="5ea16c600e2fab71928a6152"
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
  test('should test the schedule dialog component', () => {
    initStoreAndRender();

    expect(screen.getByText('Flow schedule override')).toBeInTheDocument();
    expect(screen.getByText('FlowSchedule')).toBeInTheDocument();
    expect(screen.getByText('formKey: flow-schedule')).toBeInTheDocument();
    expect(screen.getByText('pgexportId: resourceId')).toBeInTheDocument();
    expect(screen.getByText('disabled : true')).toBeInTheDocument();
    expect(screen.getByText('index: 1')).toBeInTheDocument();
    expect(screen.getByText('Name of the flow')).toBeInTheDocument();
  });
  test('should test the onclose modal component function', () => {
    const mockSetCancelTriggered = jest.fn();

    jest.spyOn(cancelContext, 'default').mockReturnValue({disabled: false, setCancelTriggered: mockSetCancelTriggered});
    initStoreAndRender();
    userEvent.click(screen.getByRole('button'));

    expect(mockSetCancelTriggered).toHaveBeenCalled();
  });
});
