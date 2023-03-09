
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import FlowStepDebugLogs from '.';

const props = {
  flowId: 'random_mock_flowId',
  resourceType: 'imports',
  resourceId: 'random_resource_id_mock',
};

async function initFlowStepDebugLogs(props = {}) {
  const ui = (
    <MemoryRouter>
      <FlowStepDebugLogs {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('../Right', () => ({
  __esModule: true,
  ...jest.requireActual('../Right'),
  default: ({children}) => children,
}));
jest.mock('../Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../Right/DrawerHeader'),
  default: ({children}) => children,
}));
const mockHistoryGoBack = jest.fn();
const mockHistoryReplace = jest.fn();
const mockLengthFn = jest.fn().mockReturnValue(1);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    replace: mockHistoryReplace,
    length: mockLengthFn(),

  }),
}));

describe('FlowStepDebugLogs tests', () => {
  afterEach(() => {
    mockHistoryReplace.mockClear();
    mockHistoryGoBack.mockClear();
  });
  test('Should able to test the drawer is there', async () => {
    await initFlowStepDebugLogs(props);
    expect(screen.queryByText(/Close/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', {name: /Close/i}));
    expect(mockHistoryReplace).toBeCalledWith('/');
  });
  test('Should able to test the drawer closes when clicked on "Close" button', async () => {
    mockLengthFn.mockReturnValue(5);
    await initFlowStepDebugLogs(props);
    await userEvent.click(screen.getByRole('button', {name: /Close/i}));
    expect(mockHistoryGoBack).toBeCalled();
  });
});
