
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import RouterPrompt from '.';
import { ConfirmDialogProvider } from '../../../../../components/ConfirmDialog';
import { renderWithProviders } from '../../../../../test/test-utils';

async function initRouterPromot({show} = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/myAccount/security/mfa'}]}
    >
      <Route
        path="/myAccount/security/mfa"
      >
        <ConfirmDialogProvider>
          <RouterPrompt show={show} />
        </ConfirmDialogProvider>
      </Route>

    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
let mockHistoryBlock = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    block: mockHistoryBlock,
    push: mockHistoryPush,
  }),
}));

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

describe('Testsuite for Router prompt', () => {
  test('should test the router prompt when show is true and click on cancel button on modal dialog box', async () => {
    mockHistoryBlock = jest.fn(cb => {
      cb({pathname: '/myAccount/transfers'}, 'PUSH');
    });
    const { utils } = await initRouterPromot({show: true});

    expect(screen.getByText(/cancel mfa setup\?/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to leave\? your mfa settings will be disabled unless you connect your device successfully\./i)).toBeInTheDocument();
    const cancelButtonNode = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelButtonNode).toBeInTheDocument();
    await userEvent.click(cancelButtonNode);
    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test the router prompt when show is true and click on continue setup button on modal dialog box', async () => {
    mockHistoryBlock = jest.fn(cb => {
      cb({pathname: '/myAccount/transfers'}, 'PUSH');
    });
    await initRouterPromot({show: true});

    expect(screen.getByText(/cancel mfa setup\?/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to leave\? your mfa settings will be disabled unless you connect your device successfully\./i)).toBeInTheDocument();
    const continueSetupButtonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'Continue setup');

    expect(continueSetupButtonNode).toBeInTheDocument();
    await userEvent.click(continueSetupButtonNode);
    await waitFor(() => expect(continueSetupButtonNode).not.toBeInTheDocument());
  });
  test('should test the router prompt when show is false', async () => {
    mockHistoryBlock = jest.fn(cb => {
      cb({pathname: '/myAccount/transfers'}, 'PUSH');
    });
    const {utils} = await initRouterPromot({show: false});

    expect(utils.container).toBeEmptyDOMElement();
  });
});

