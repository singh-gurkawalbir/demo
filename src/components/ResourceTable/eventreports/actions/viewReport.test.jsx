/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';
import metadata from '../metadata';
import CeligoTable from '../../../CeligoTable';

const initialStore = reduxStore;

initialStore.getState().data.resources = {
  flows: [{
    _id: '6287678bdh893338hdn3',
    name: 'flow name 1',
    _integrationId: '6287678493nff8e93873',
  }]};

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: `/integrations/${data.integrationId}/view/reportDetails/:reportId`}]}>
      <Route path="/integrations/:integrationId">
        <CeligoTable
          {...metadata}
          data={[data]} />
      </Route>
    </MemoryRouter>, {initialStore}
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('UI test cases for view report', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should make a history call after clicking on view report details', () => {
    renderFuntion({_id: '6287678bdh893338hdn3', status: 'completed', _flowIds: ['6287678bdh893338hdn3'], integrationId: '6287678493nff8e93873'});
    const viewReportsButton = screen.getByText('View report details');

    userEvent.click(viewReportsButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/6287678493nff8e93873/view/reportDetails/6287678bdh893338hdn3');
  });
});
