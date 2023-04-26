
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LookupListRow from './LookupListRow';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initLookupListRow({ props, value = {name: 'DummyName'}, classes = {
  actionButton: 'makeStyles-actionButton-656',
  columnAction: 'makeStyles-columnAction-659',
  columnName: 'makeStyles-columnName-658',
  listing: 'makeStyles-listing-655',
  row: 'makeStyles-row-657',
} } = {}) {
  const ui = (
    <MemoryRouter>
      <table>
        <tbody>
          <LookupListRow
            classes={classes}
            value={value}
            {...props}
          />
        </tbody>
      </table>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('lookupListRow component Test cases', () => {
  runServer();
  test('should pass the intial render with default values', async () => {
    await initLookupListRow();

    expect(screen.queryByText(/DummyName/i)).toBeInTheDocument();
  });

  test('should pass the menu actions', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    await initLookupListRow({
      props: {
        onEdit,
        onDelete,
      },
    });
    const lookupName = screen.queryByText(/DummyName/i);

    expect(lookupName).toBeInTheDocument();

    const actionButton = screen.getAllByRole('button').find(eachButton => eachButton.hasAttribute('data-test', 'openActionsMenu'));

    expect(actionButton).toBeInTheDocument();

    await userEvent.click(actionButton);

    const editLookup = await screen.getByRole('menuitem', {name: /Edit lookup/i});
    const deleteLookup = screen.getByRole('menuitem', {name: /Delete lookup/i});

    expect(editLookup).toBeInTheDocument();
    expect(deleteLookup).toBeInTheDocument();

    await userEvent.click(editLookup);
    expect(onEdit).toHaveBeenCalledTimes(1);

    await userEvent.click(deleteLookup);
    expect(onDelete).toHaveBeenCalledTimes(1);

    await userEvent.click(document.querySelector('#row-actions'));

    await waitFor(() => expect(screen.queryByText(/Edit lookup/i)).not.toBeInTheDocument());
  });
});
