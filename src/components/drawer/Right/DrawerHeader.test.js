
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DrawerHeader from './DrawerHeader';
import {useDrawerContext, DrawerProvider} from './DrawerContext';

const MockComponent = () => {
  const { onClose } = useDrawerContext();

  return (
    <>
      <button type="button" onClick={onClose}>
        Click
      </button>
    </>
  );
};
const mockHistoryGoBack = jest.fn();
const drawerProviderProps = {
  onClose: mockHistoryGoBack,
  height: 'short',
  fullPath: '/',
};

async function initRightDrawerComponents(props = {}) {
  const ui = (
    <MemoryRouter>
      <DrawerProvider {...drawerProviderProps}>
        <DrawerHeader {...props} />
      </DrawerProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('DrawerHeader tests', () => {
  test('Should able to test the DrawerHeader render with BackButton', async () => {
    await initRightDrawerComponents({children: <MockComponent />, title: 'Drawer header', showBackButton: true, closeDataTest: 'customCloseRightDrawer'});
    const childButton = screen.getByRole('button', {name: 'Click'});
    const buttons = screen.getAllByRole('button');

    expect(childButton).toBeInTheDocument();
    await userEvent.click(childButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    expect(screen.getByText('Drawer header')).toBeInTheDocument();
    const backButton = buttons.find(btn => btn.getAttribute('data-test') === 'backRightDrawer');
    const closeButton = buttons.find(btn => btn.getAttribute('data-test') === 'customCloseRightDrawer');

    expect(backButton).toBeInTheDocument();
    await userEvent.click(backButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });

  test('Should able to test the DrawerHeader render with helpButton and Info icon', async () => {
    await initRightDrawerComponents({helpKey: 'formView', infoText: 'get info from here'});
    const buttons = screen.getAllByRole('button');
    const helpIcon = buttons.find(btn => !btn.hasAttribute('data-test') && btn.querySelector('svg[viewBox="0 0 24 24"]'));

    expect(helpIcon).toBeInTheDocument();
    await userEvent.click(helpIcon);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const infoIcon = buttons.find(btn => btn.getAttribute('data-test') === 'openPageInfo');

    expect(infoIcon).toBeInTheDocument();
    await userEvent.click(infoIcon);
    waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('get info from here')).toBeInTheDocument();
    });
  });

  test('Should able to test the DrawerHeader render with Custom CloseButton only', async () => {
    await initRightDrawerComponents({CloseButton: <MockComponent />, title: 'Drawer header'});
    const customCloseButton = screen.getByRole('button', {name: 'Click'});

    expect(customCloseButton).toBeInTheDocument();
    await userEvent.click(customCloseButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});
