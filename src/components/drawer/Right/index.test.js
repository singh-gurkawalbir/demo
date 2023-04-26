
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import RightDrawerRoute from '.';
import DrawerSubHeader from './DrawerSubHeader';
import DrawerContent from './DrawerContent';
import DrawerFooter from './DrawerFooter';

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
let renderFun;
let initialStore;

async function initRightDrawerRoute(props = {}) {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: props.path}]}>
      <RightDrawerRoute {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

async function initRightDrawerComponents(Component, props = {children: <MockComponent />}) {
  const ui = (
    <MemoryRouter>
      <DrawerProvider>
        <Component {...props} />
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

describe('RightDrawer tests', () => {
  test('Should able to test the RightDrawerRoute initial render without path', async () => {
    await initRightDrawerRoute({children: <MockComponent />});
    expect(screen.queryByText('Click')).not.toBeInTheDocument();
  });

  test('Should able to test the RightDrawerRoute initial render with fullwidth', async () => {
    await initRightDrawerRoute({children: <MockComponent />, width: 'full', path: '/path'});
    expect(screen.queryByText('Click')).toBeInTheDocument();
  });

  test('Should able to test the RightDrawerRoute initial render with pathArray', async () => {
    await initRightDrawerRoute({children: <MockComponent />, path: ['/path']});
    const click = screen.getByRole('button', {name: 'Click'});

    expect(click).toBeInTheDocument();
    await userEvent.click(click);
    expect(mockHistoryGoBack).toBeCalled();
  });
  test('Should able to test the RightDrawerRoute initial render with path and onClose', async () => {
    await initRightDrawerRoute({children: <MockComponent />, path: '/path', onClose: mockHistoryGoBack});
    const click = screen.getByRole('button', {name: 'Click'});

    expect(click).toBeInTheDocument();
    await userEvent.click(click);
    expect(mockHistoryGoBack).toBeCalled();
  });

  test('Should able to test the DrawerSubHeader render', async () => {
    await initRightDrawerComponents(DrawerSubHeader);
    expect(screen.queryByText('Click')).toBeInTheDocument();
  });
  test('Should able to test the DrawerFooter render', async () => {
    await initRightDrawerComponents(DrawerFooter);
    expect(screen.queryByText('Click')).toBeInTheDocument();
  });
  test('Should able to test the DrawerContent render', async () => {
    await initRightDrawerComponents(DrawerContent);
    expect(screen.queryByText('Click')).toBeInTheDocument();
  });
});
