/* eslint-disable jest/expect-expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material';
import { renderWithProviders } from '../../test/test-utils';
import MuiBox from './index';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#8EC635',
    },
  },
});

describe('MuiBox Widget Plugin', () => {
  test('renders without crashing', () => {
    renderWithProviders(<ThemeProvider theme={theme}><MuiBox data={[]} /></ThemeProvider>);
  });

  test('displays the correct number of connections', () => {
    const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const mockValue = 'connections';

    renderWithProviders(
      <ThemeProvider theme={theme}><MuiBox data={mockData} value={mockValue} /></ThemeProvider>
    );

    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByTestId('box')).toHaveStyle({ backgroundColor: 'white' });
    expect(screen.getByTestId('subheading')).toHaveTextContent('connections');
    expect(screen.getByTestId('heading')).toHaveTextContent('3');
  });

  test('renders MuiBox component with correct props', () => {
    const data = [{ id: 1 }, { id: 2 }];

    renderWithProviders(<ThemeProvider theme={theme}><MuiBox data={data} value="flows" /></ThemeProvider>);
    expect(screen.getByTestId('box')).toHaveStyle({ backgroundColor: 'white' });
    expect(screen.getByTestId('heading')).toHaveTextContent('2');
    expect(screen.getByTestId('subheading')).toHaveTextContent('flows');
  });
});
