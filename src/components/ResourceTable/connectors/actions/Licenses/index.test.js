
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

describe('uI test cases for licenses', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should redirect to licenses page after clicking on licenses button', () => {
    const applications = ['3dcart', 'docusign', 'salesforce', 'magento'];

    renderFuntion({_id: 'someappKey', applications});
    const Licenses = screen.getByText('Licenses');

    userEvent.click(Licenses);
    expect(mockHistoryPush).toHaveBeenCalledWith('/connectors/someappKey/connectorLicenses');
  });
});
