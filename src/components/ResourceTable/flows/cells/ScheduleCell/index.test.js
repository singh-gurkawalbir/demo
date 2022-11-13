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

function initScheduleCell(actionProps = {}, initialStore = null) {
  const ui = (
    <MemoryRouter initialEntries={['/parentUrl']}>
      <Route path="/parentUrl">
        <ScheduleCell
          flowId="someflowId"
          name="someName"
          actionProps={actionProps}
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
    expect(screen.getByTitle('Configure all steps to allow scheduling your flow')).toBeInTheDocument();
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-disabled', 'true');

    expect(button).toHaveAttribute('href', '/parentUrl/someflowId/schedule');
  });
  test('should show tooltip for configure schedule', () => {
    initScheduleCell({flowAttributes: {someflowId: {allowSchedule: true, type: 'Scheduled'}}});

    expect(screen.getByTitle('Change schedule')).toBeInTheDocument();
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('href', '/parentUrl/someflowId/schedule');
  });
});
