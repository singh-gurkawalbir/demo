/* global describe, test, expect, beforeEach, jest, afterEach */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import Audit from './Audit';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initAudit() {
  const ui = (
    <MemoryRouter>
      <Audit />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('Audit test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initAudit();
    expect(screen.queryByText(/Audit log/i)).toBeInTheDocument();
  });
});
