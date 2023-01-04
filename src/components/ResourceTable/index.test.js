
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import ResourceTable from '.';

jest.mock('../CeligoTable', () => ({
  __esModule: true,
  ...jest.requireActual('../CeligoTable'),
  default: props => (
    <div>
      <div>{`data = ${props.data}`}</div>
      <div>{`filterkey = ${props.filterkey}`}</div>
      <div>{`actionProps = ${JSON.stringify(props.actionProps)}`}</div>
    </div>
  ),
}));
describe('uI test cases for ResourceTable', () => {
  test('should display the data of the resource', () => {
    renderWithProviders(<ResourceTable data="connections" />);
    expect(screen.getByText('data = connections')).toBeInTheDocument();
  });

  test('should display resources are in filterkey', () => {
    renderWithProviders(<ResourceTable filterkey="exports" />);
    expect(screen.getByText('filterkey = exports')).toBeInTheDocument();
  });

  test('should display showtrading partner and the resourcetype', () => {
    renderWithProviders(
      <MemoryRouter>
        <ResourceTable
          actionProps={{ showTradingPartner: true }}
          resourceType="imports"
        />
      </MemoryRouter>
    );
    expect(
      screen.getByText(
        'actionProps = {"showTradingPartner":true,"resourceType":"imports"}'
      )
    ).toBeInTheDocument();
  });
});
