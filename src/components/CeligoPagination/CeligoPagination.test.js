import React from 'react';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import CeligoPagination from '.';

function onChangePage(event, page) {
  const display = `Go to ${page}`;

  render(<div>{display}</div>);
}
function loadMoreHandler() {
  render(<div>LoadMore Handler</div>);
}
function onChangeRowsPerPage(e) {
  const display = `Rows Per Page Changed to ${e.target.value}`;

  render(<div> {display}</div>);
}

describe('celigoPagination test', () => {
  test('rendering and clicking on', async () => {
    const props = {
      loading: false,
      page: 1,
      rowsPerPage: 2,
      count: 10,
      hasMore: true,
      onChangePage,
    };

    renderWithProviders(<CeligoPagination {...props} />);
    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[0]);
    expect(screen.getByText(`Go to ${props.page - 1}`)).toBeInTheDocument();
    await userEvent.click(buttons[1]);
    expect(screen.getByText(`Go to ${props.page + 1}`)).toBeInTheDocument();
  });

  test('rendering and clicking on loadmore handler', async () => {
    const props = {
      loading: false,
      page: 1,
      rowsPerPage: 2,
      count: 3,
      hasMore: true,
      onChangePage,
      loadMoreHandler,
    };

    renderWithProviders(<CeligoPagination {...props} />);
    const buttons = screen.getAllByRole('button');

    await userEvent.click(buttons[1]);
    expect(screen.getByText('LoadMore Handler')).toBeInTheDocument();
  });
  test('disables next page', () => {
    const props = {
      loading: false,
      page: 1,
      rowsPerPage: 2,
      count: 3,
      hasMore: false,
      onChangePage,
      loadMoreHandler,
    };

    renderWithProviders(<CeligoPagination {...props} />);
    const buttons = screen.getAllByRole('button');

    expect(buttons[1]).toBeDisabled();
  });
  test('disables previous page', () => {
    const props = {
      loading: false,
      page: 0,
      rowsPerPage: 2,
      count: 3,
      hasMore: false,
      onChangePage,
      loadMoreHandler,
    };

    renderWithProviders(<CeligoPagination {...props} />);
    const buttons = screen.getAllByRole('button');

    expect(buttons[0]).toBeDisabled();
  });

  test('loding spinnner', () => {
    const props = {
      loading: true,
      page: 0,
      rowsPerPage: 2,
      count: 3,
      hasMore: false,
      onChangePage,
      loadMoreHandler,
    };

    renderWithProviders(<CeligoPagination {...props} />);

    const progressbar = screen.queryByRole('progressbar');

    expect(progressbar).toBeInTheDocument();
  });

  test('rendering wiht rwo per page option', async () => {
    const rowsPerPageOptions = [1, 2, 3];
    const props = {
      rowsPerPageOptions,
      loading: true,
      page: 0,
      rowsPerPage: 2,
      count: 3,
      hasMore: false,
      onChangePage,
      loadMoreHandler,
      onChangeRowsPerPage,
    };

    renderWithProviders(<CeligoPagination {...props} />);
    const rowsPerPage = screen.getByText('2');

    await userEvent.click(rowsPerPage);
    const currentrowsPerPage = screen.getByText('1');

    await userEvent.click(currentrowsPerPage);
    expect(screen.getByText('Rows Per Page Changed to 1')).toBeInTheDocument();
  });
});
