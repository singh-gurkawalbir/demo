/* global describe, test,expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore} from '../../../../../test/test-utils';
import ScheduleCell from '.';

const initialStore = reduxStore;

initialStore.getState().data.resources.flows = [
  {
    _id: 'someflowId',
    name: 'demo flow',
    disabled: false,
    _integrationId: 'integration_id',
    pageGenerators: [{setupInProgress: true}],
    pageProcessors: [{
      type: 'import',
      _importId: 'resource_id',
    }],
  },
];

describe('Shecdule cell UI test cases', () => {
  test('should show the type provided', () => {
    renderWithProviders(
      <MemoryRouter><ScheduleCell
        flowId="someflowId"
        name="someName"
        actionProps={{flowAttributes: {someflowId: {type: 'SomeType'}}}}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('SomeType')).toBeInTheDocument();
  });
  test('should show empty dom', () => {
    const {utils} = renderWithProviders(
      <MemoryRouter><ScheduleCell
        flowId="someflowId"
        name="someName"
        actionProps={{flowAttributes: {someflowId: {type: 'Scheduled'}}}}
        />
      </MemoryRouter>
    );

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should show toottil for configure all steps', () => {
    renderWithProviders(
      <MemoryRouter><ScheduleCell
        flowId="someflowId"
        name="someName"
        actionProps={{flowAttributes: {someflowId: {allowSchedule: true, type: 'Scheduled'}}}}
        />
      </MemoryRouter>, {initialStore}
    );
    expect(screen.getByTitle('Configure all steps to allow scheduling your flow')).toBeInTheDocument();
  });
  test('should show tooltip for configure shudel', () => {
    renderWithProviders(
      <MemoryRouter><ScheduleCell
        flowId="someflowId"
        name="someName"
        actionProps={{flowAttributes: {someflowId: {allowSchedule: true, type: 'Scheduled'}}}}
        />
      </MemoryRouter>
    );
    expect(screen.getByTitle('Configure all steps to allow scheduling your flow')).toBeInTheDocument();
  });
});
