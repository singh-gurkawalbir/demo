import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import ConditionalLookupDrawer from './Drawer';

function initConditionalLookupDrawer(props, paramsData, pathNameData, pathData) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: pathNameData}]}
    >
      <Route
        path={pathData}
        params={paramsData}
      >
        <ConditionalLookupDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  render(ui);
}

jest.mock('../../../../drawer/Right/DrawerContent', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right/DrawerContent'),
  default: props => (
    <div>
      <div>Mock Drawer Content</div>
      <div>{props.children}</div>
    </div>
  ),
}));
jest.mock('.', () => ({
  __esModule: true,
  ...jest.requireActual('.'),
  default: () => (
    <div>
      <div>Mock Conditional Lookup</div>
    </div>
  ),
}));
jest.mock('../../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right'),
  default: props => (
    <div>
      <div>Mock Right Drawer</div>
      <div>{props.children}</div>
    </div>
  ),
}));
jest.mock('../../../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right/DrawerHeader'),
  default: props => (
    <div>
      <div>Mock Drawer Header</div>
      <div>title = {props.title}</div>
    </div>
  ),
}));
describe('Testsuite for ConditionalLookupDrawer', () => {
  test('should test the Drawer Header title as Edit Lookup when there is a lookupName param', () => {
    initConditionalLookupDrawer({test: 'test1'}, {lookupName: 'add'}, '/conditionalLookup/add', '/conditionalLookup/:lookupName');
    expect(screen.getByText(/mock right drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mock drawer header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = edit lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/mock drawer content/i)).toBeInTheDocument();
    expect(screen.getByText(/mock conditional lookup/i)).toBeInTheDocument();
  });
  test('should test the Drawer Header title as Add Lookup when there is no lookupName param', () => {
    initConditionalLookupDrawer({test: 'test1'}, '', '/conditionalLookup', '/conditionalLookup');
    expect(screen.getByText(/mock right drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/mock drawer header/i)).toBeInTheDocument();
    expect(screen.getByText(/title = add lookup/i)).toBeInTheDocument();
    expect(screen.getByText(/mock drawer content/i)).toBeInTheDocument();
    expect(screen.getByText(/mock conditional lookup/i)).toBeInTheDocument();
  });
});
