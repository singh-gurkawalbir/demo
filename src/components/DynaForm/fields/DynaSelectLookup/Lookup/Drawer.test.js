import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LookupDrawer from './Drawer';

function initLookupDrawer(props, {pathData, paramsData, pathnameData}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: pathnameData}]}
    >
      <Route
        path={pathData}
        params={paramsData}
      >
        <LookupDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return render(ui);
}
jest.mock('../../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right'),
  default: props => (
    <div>
      Mock Right Drawer
      <div>height = {props.height}</div>
      <div>width = {props.width}</div>
      <button onClick={props.onClose} type="button">Close</button>
      {props.children}
    </div>
  ),
}));
jest.mock('../../../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right/DrawerHeader'),
  default: props => (
    <div>
      Mock Drawer Header
      <div>title = {props.title}</div>
    </div>
  ),
}));
jest.mock('.', () => ({
  __esModule: true,
  ...jest.requireActual('.'),
  default: () => (
    <div>
      Mock Lookup
    </div>
  ),
}));

const mockSetCancelTriggered = jest.fn();

jest.mock('../../../../FormOnCancelContext', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../FormOnCancelContext'),
  default: () => ({
    setCancelTriggered: mockSetCancelTriggered,
  }),
}));

describe('Testsuite for Lookup Drawer', () => {
  afterEach(() => {
    mockSetCancelTriggered.mockClear();
  });
  test('should test the isEdit lookup title when the isEdit is set to true', () => {
    initLookupDrawer({test: '123'}, {pathData: '/test/lookups/edit/:lookupName', paramsData: {lookupName: 'testLookupName'}, pathnameData: '/test/lookups/edit/lookupName'});
    expect(screen.getByText(/mock drawer header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = edit lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/mock lookup/i)).toBeInTheDocument();
  });
  test('should test the create lookup title when the isEdit is set to false', () => {
    initLookupDrawer({test: '123'}, {pathData: '/test/lookups', paramsData: '', pathnameData: '/test/lookups'});
    expect(screen.getByText(/mock drawer header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = create lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/mock lookup/i)).toBeInTheDocument();
  });
  test('should test the cancel button of the right drawer', async () => {
    initLookupDrawer({test: '123'}, {pathData: '/test/lookups', paramsData: '', pathnameData: '/test/lookups'});
    expect(screen.getByText(/mock right drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/height = tall/i)).toBeInTheDocument();
    expect(screen.getByText(/width = default/i)).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', {
      name: /close/i,
    });

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(mockSetCancelTriggered).toHaveBeenCalled();
  });
});
