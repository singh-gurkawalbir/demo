/* global test, expect, describe, beforeEach, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../../test/test-utils';
import metadata from '../../metadata';
import CeligoTable from '../../../../CeligoTable';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../CeligoTable/TableContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../CeligoTable/TableContext'),
  useGetTableContext: () => ({
    resourceType: 'connectors',
  }),
}));
function renderFuntion(data) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        {...metadata}
        data={[data]}
        />
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('UI test cases for install base ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should render table accordingly', () => {
    const applications = ['3dcart', 'docusign', 'salesforce', 'magento'];

    renderFuntion({_id: 'someappKey', applications});
    const viewresourcechanged = screen.getByText('Install base');

    userEvent.click(viewresourcechanged);
    expect(mockHistoryPush).toHaveBeenCalledWith('/connectors/someappKey/installBase');
  });
});
