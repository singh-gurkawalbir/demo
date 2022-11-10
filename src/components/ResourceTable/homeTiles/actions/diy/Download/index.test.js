/* global test, expect, describe, jest, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import metadata from '../../../metadata';
import CeligoTable from '../../../../../CeligoTable';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const initialStore = reduxStore;

initialStore.getState().user.preferences = {defaultAShareId: 'own'};

function initHomeTiles(data = {}, initialStore = null) {
  const ui = (
    <MemoryRouter>
      <CeligoTable {...metadata} data={[data]} />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe("HomeTile's Download Action UI tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should make dispatch call wgen download button is clicked', () => {
    initHomeTiles({key: 'somekey', name: 'tileName', pinned: false, _integrationId: '2_integrationId', supportsMultiStore: true}, initialStore);
    userEvent.click(screen.queryByRole('button', {name: /more/i}));

    userEvent.click(screen.getByText('Download integration'));
    expect(mockDispatch).toHaveBeenCalledWith(actions.template.generateZip('2_integrationId'));
  });
});
