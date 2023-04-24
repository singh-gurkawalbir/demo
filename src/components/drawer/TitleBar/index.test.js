
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DrawerTitleBar from '.';

const close = jest.fn();
const mockHistoryGoBack = jest.fn();

const props = {
  title: 'Drawer Title',
  helpKey: '_helpKey',
  helpTitle: '_helpTitle',
  backToParent: false,
  disableClose: false,
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

async function initDrawerTitleBar(props = {}) {
  const ui = (
    <MemoryRouter>
      <DrawerTitleBar {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('DrawerTitleBar tests', () => {
  afterEach(() => {
    mockHistoryGoBack.mockClear();
  });
  test('Should able to test the drawerTitle is there without backIcon and helpkey', async () => {
    await initDrawerTitleBar({...props, onClose: close});
    expect(screen.getByText(/Drawer Title/i)).toBeInTheDocument();
    const titleButtons = screen.getAllByRole('button');
    const closeIcon = titleButtons.find(el => el.getAttribute('aria-label'));

    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    expect(close).toHaveBeenCalled();
  });
  test('Should able to test the drawerTitle is there with helpkey and backIcon', async () => {
    await initDrawerTitleBar({...props, backToParent: true, helpKey: 'formView'});
    expect(screen.getByText(/Drawer Title/i)).toBeInTheDocument();
    const titleButtons = screen.getAllByRole('button');
    const helpButton = titleButtons.find(btn => !btn.hasAttribute('data-test') && btn.querySelector('svg[viewBox="0 0 24 24"]'));

    await userEvent.click(helpButton);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('_helpTitle')).toBeInTheDocument();
    expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
    const backButton = titleButtons.find(el => el.getAttribute('aria-label') === 'back');

    await userEvent.click(backButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
    const closeIcon = titleButtons.find(el => el.getAttribute('aria-label'));

    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
  test('Should able to test the drawerTitle  back button with onclose', async () => {
    await initDrawerTitleBar({...props, onClose: close});
    const titleButtons = screen.getAllByRole('button');
    const closeIcon = titleButtons.find(el => el.getAttribute('aria-label'));

    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    expect(close).toHaveBeenCalled();
  });
  test('Should able to test the drawerTitle Help title without helptitle', async () => {
    await initDrawerTitleBar({...props, helpKey: 'formView', helpTitle: ''});
    const titleButtons = screen.getAllByRole('button');
    const helpButton = titleButtons.find(btn => !btn.hasAttribute('data-test') && btn.querySelector('svg[viewBox="0 0 24 24"]'));

    await userEvent.click(helpButton);
    expect(screen.queryByText('_helpTitle')).not.toBeInTheDocument();
    expect(screen.queryAllByText('Drawer Title')).toHaveLength(2);
  });
});
