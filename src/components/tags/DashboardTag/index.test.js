
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import DashboardTag from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initDashboardTag({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <DashboardTag {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('dashboardTag test cases', () => {
  runServer();
  test('should pass the initial render with default values', async () => {
    await initDashboardTag({
      props: {
        label: 'mock label',
      },
    });
    const mockEle = screen.queryByText('mock label');

    expect(mockEle).toBeInTheDocument();
  });

  test('should pass the initial render with custom values', async () => {
    await initDashboardTag({
      props: {
        label: 'mock label',
        errorCount: 1,
        resolvedCount: 1,
      },
    });

    expect(screen.queryByText('mock label')).toBeInTheDocument();
  });
  test('should pass the initial render with errorCount value', async () => {
    await initDashboardTag({
      props: {
        label: 'mock label',
        errorCount: 1,
      },
    });

    expect(screen.queryByText('mock label')).toBeInTheDocument();
  });
  test('should pass the initial render with resolvedCount value', async () => {
    await initDashboardTag({
      props: {
        label: 'mock label',
        resolvedCount: 1,
      },
    });

    expect(screen.queryByText('mock label')).toBeInTheDocument();
  });
});
