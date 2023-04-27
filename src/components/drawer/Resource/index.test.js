
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import ResourceDrawer from '.';

const props = {
  flowId: '_flowId',
  integrationId: '_integrationId',
};

async function initResourceDrawer(props = {}, resourceType, operation = 'edit') {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/_integrationId/flowbuilder/_flowId/${operation}/${resourceType}/_resourceId`}]}>
      <Route path="/integrations/_integrationId/flowbuilder/_flowId" >
        <ResourceDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
const mockHistoryGoBack = jest.fn();
const mockHistoryReplace = jest.fn();
const mockLengthFn = jest.fn().mockReturnValue(4);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
    replace: mockHistoryReplace,
    length: mockLengthFn(),

  }),
}));

jest.mock('../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../LoadResources'),
  default: ({children}) => (<>{children}</>),
}));
jest.mock('./Panel/ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('./Panel/ResourceFormActionsPanel'),
  default: props =>
    (
      <button onClick={props.onCancel} type="button">HERE
      </button>
    )
  ,
}));

describe('ResourceDrawer tests', () => {
  afterEach(() => {
    mockHistoryReplace.mockClear();
    mockHistoryGoBack.mockClear();
  });

  test('Should able to test the initial render with ResourceDrawer', async () => {
    mockLengthFn.mockReturnValue(2);
    await initResourceDrawer(props, 'imports');
    await waitFor(() => expect(screen.getByRole('heading', {name: 'Edit import'})).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', {name: 'HERE'}));
    expect(mockHistoryReplace).toHaveBeenCalledWith('/integrations/_integrationId/flowbuilder/_flowId');
  });

  test('Should able to test the initial render with ResourceDrawer with asyncHelpers', async () => {
    mockLengthFn.mockReturnValue(5);
    await initResourceDrawer(props, 'asyncHelpers');
    await waitFor(() => expect(screen.getByRole('heading', {name: 'Edit async helper'})).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', {name: 'HERE'}));
    expect(mockHistoryGoBack).toBeCalled();
  });
});
