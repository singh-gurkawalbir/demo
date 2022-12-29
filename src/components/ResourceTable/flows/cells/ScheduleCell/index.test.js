/* global describe, test,expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
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

function initScheduleCell(actionProps = {}, initialStore = null, schedule = '') {
  const ui = (
    <MemoryRouter initialEntries={['/integrations/integration_id/flows']}>
      <Route path="/integrations/integration_id">
        <ScheduleCell
          flowId="someflowId"
          name="someName"
          actionProps={actionProps}
          schedule={schedule}
        />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Shecdule cell UI test cases', () => {
  test('should show the type provided', () => {
    initScheduleCell({flowAttributes: {someflowId: {type: 'SomeType'}}});

    expect(screen.getByText('SomeType')).toBeInTheDocument();
  });
  test('should show empty dom', () => {
    const {utils} = initScheduleCell({flowAttributes: {someflowId: {type: 'Scheduled'}}});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should show tooltip for configure all steps', () => {
    initScheduleCell({flowAttributes: {someflowId: {allowSchedule: true, type: 'Scheduled'}}}, initialStore);
    expect(screen.getByTitle('Remove or configure all unconfigured flow steps to edit the flow schedule')).toBeInTheDocument();
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');

    expect(button).toHaveAttribute('href', '/integrations/integration_id/flows/someflowId/schedule');
  });
  test('should show tooltip for configure schedule', () => {
    initScheduleCell({flowAttributes: {someflowId: {allowSchedule: true, type: 'Scheduled'}}});

    expect(screen.getByTitle('Add schedule')).toBeInTheDocument();
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('href', '/integrations/integration_id/flows/someflowId/schedule');
  });
  test('should show icon indicator for scheduled flows', () => {
    initScheduleCell({flowAttributes: {someflowId: {allowSchedule: true}}}, null, 'some schedule');

    expect(document.querySelector('div div div').className).toContain('circle');
  });
  test('should not show icon indicator for unscheduled flows', () => {
    initScheduleCell({flowAttributes: {someflowId: {allowSchedule: true}}}, null);

    expect(document.querySelector('div div div').className).not.toContain('circle');
  });
});
