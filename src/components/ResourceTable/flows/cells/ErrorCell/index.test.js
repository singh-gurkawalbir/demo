
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore} from '../../../../../test/test-utils';
import RunCell from '.';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.errorManagement.openErrors = {
    '62662cc4e06ff462c3db470e': {data: {
      flow_id1: {
        numError: 5,
      },
      flow_id2: {
        numError: 1,
      },
    }},
  };
});

function initErrorCell(flowID, initialStore = null) {
  const ui = (
    <MemoryRouter initialEntries={['/integrations/62662cc4e06ff462c3db470e/flows']}>
      <Route path="/integrations/62662cc4e06ff462c3db470e/flows">
        <RunCell flowId={flowID} integrationId="62662cc4e06ff462c3db470e" />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('error Cell of flow table ui test cases', () => {
  test('should show success messsage when no props provided', () => {
    renderWithProviders(<MemoryRouter><RunCell /></MemoryRouter>);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('Success');
  });
  test('should show success message with correct URl', () => {
    initErrorCell('flowID');
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('Success');
  });
  test('should show error count as 5', () => {
    initErrorCell('flow_id1', initialStore);
    const link = screen.getByRole('link');

    expect(link.textContent).toBe('5 errors');
    expect(link).toHaveAttribute('href', '/integrations/62662cc4e06ff462c3db470e/flows/flow_id1/errorsList');
  });
  test('should show only one error', () => {
    initErrorCell('flow_id2', initialStore);

    const link = screen.getByRole('link');

    expect(link.textContent).toBe('1 error');
    expect(link).toHaveAttribute('href', '/integrations/62662cc4e06ff462c3db470e/flows/flow_id2/errorsList');
  });
});
