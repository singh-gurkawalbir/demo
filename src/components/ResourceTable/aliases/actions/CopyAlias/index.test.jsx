/* global test, expect, describe, beforeEach, afterEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import * as mockEnqueSnackbar from '../../../../../hooks/enqueueSnackbar';
import CeligoTable from '../../../../CeligoTable';

const enqueueSnackbar = jest.fn();

window.prompt = jest.fn();

function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole('button', { name: /more/i }));
}

describe('UI test cases for copy alias ', () => {
  beforeEach(() => {
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    enqueueSnackbar.mockClear();
  });
  test('should display a prompt after clicking on copy alias', async () => {
    renderFuntion({_connectionId: '62f0d335e77a2e04750c3951',
      _id: '12',
      alias: '12',
      type: 'connections'});
    const request = screen.getByText('Copy alias');

    userEvent.click(request);
    await waitFor(() => {
      expect(window.prompt).toHaveBeenCalled();
    });
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Alias copied to clipboard.'});
  });
});
