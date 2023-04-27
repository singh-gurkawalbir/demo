
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaSelectDataRetentionPeriod from '.';
import {renderWithProviders} from '../../../../test/test-utils';

describe('dynaSelectDataRetentionPeriod UI tests', () => {
  const props = {
    id: 'dataRetentionPeriod',
    label: 'Data retention period',
    onFieldChange: jest.fn(),
    value: 30,
  };

  test('should pass the initial render', () => {
    renderWithProviders(<DynaSelectDataRetentionPeriod {...props} maxAllowedDataRetention={30} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  test('should render correct options if maxAllowedDataRetention is not MAX_DATA_RETENTION_PERIOD', async () => {
    const maxAllowedDataRetention = 60;

    renderWithProviders(<DynaSelectDataRetentionPeriod {...props} maxAllowedDataRetention={maxAllowedDataRetention} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByRole('option', {name: '30 days'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '60 days'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '90 days - upgrade required'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '180 days - upgrade required'})).toBeInTheDocument();
  });
  test('should render correct options if maxAllowedDataRetention is MAX_DATA_RETENTION_PERIOD', async () => {
    const maxAllowedDataRetention = 180;

    renderWithProviders(<DynaSelectDataRetentionPeriod {...props} maxAllowedDataRetention={maxAllowedDataRetention} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    const button = screen.getByRole('button');

    await userEvent.click(button);

    expect(screen.getByRole('option', {name: '30 days'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '60 days'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '90 days'})).toBeInTheDocument();
    expect(screen.getByRole('option', {name: '180 days'})).toBeInTheDocument();
  });
});
