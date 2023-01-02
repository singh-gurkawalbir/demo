
import React from 'react';
import { screen, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import MappingCell from './index';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('suite script MappingCell ui test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when no flow is provided', () => {
    const utils = render(<MemoryRouter><MappingCell flow={{}} /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should call history push after clikcing the mapping button', () => {
    render(
      <MemoryRouter initialEntries={[{pathname: '/initialURL'}]}>
        <Route
          path="/initialURL"
          params={{}}
      ><MappingCell flow={{_id: 'flowID', editable: true}} />
        </Route>
      </MemoryRouter>);
    const mappingButton = screen.getByRole('button');

    expect(mappingButton).toBeInTheDocument();
    userEvent.click(mappingButton);
    expect(mockHistoryPush).toHaveBeenCalledWith('/initialURL/flowID/mapping');
  });
});
