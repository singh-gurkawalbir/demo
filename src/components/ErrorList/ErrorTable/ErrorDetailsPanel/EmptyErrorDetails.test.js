import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyErrorDetails from './EmptyErrorDetails';
import { DrawerProvider } from '../../../drawer/Right/DrawerContext';
import { renderWithProviders} from '../../../../test/test-utils';

const mockHistoryGoBack = jest.fn();
const drawerProviderProps = {
  onClose: mockHistoryGoBack,
  height: 'short',
  fullPath: '/',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('EmptyErrorDetails UI test cases', () => {
  const classes = {draweHeader: 'some header'};

  test('should show the content when show message is provided in the props', () => {
    const props = {
      showMessage: 'some message',
      classes,
    };

    renderWithProviders(<MemoryRouter><DrawerProvider {...drawerProviderProps}><EmptyErrorDetails {...props} /></DrawerProvider></MemoryRouter>);
    expect(screen.queryByText(/Click an error row to view its details/i)).toBeInTheDocument();
    expect(screen.queryByText(/or select the checkboxes for batch actions./i)).toBeInTheDocument();
  });
  test('should display the header when no show message provided', () => {
    renderWithProviders(<MemoryRouter><DrawerProvider {...drawerProviderProps}><EmptyErrorDetails classes={classes} /></DrawerProvider></MemoryRouter>);

    expect(screen.getByText('Error details')).toBeInTheDocument();
  });
});
