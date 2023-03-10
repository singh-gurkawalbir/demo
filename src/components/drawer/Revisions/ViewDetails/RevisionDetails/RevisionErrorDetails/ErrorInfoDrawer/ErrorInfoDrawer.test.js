
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {DrawerProvider} from '../../../../../Right/DrawerContext/index';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import ErrorInfoDrawer from '.';
import { getCreatedStore } from '../../../../../../../store';

const mockHistoryReplace = jest.fn();
const props = {integrationId: '_integrationId', revisionId: '_revisionId'};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
jest.mock('../../../../../Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../Right'),
  default: ({children}) => children,
}));

async function initErrorInfoDrawer(props = {}, errorId) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.session.lifeCycleManagement.revision._integrationId = {
      _revisionId: {
        errors: {
          data: [{code: 'err1', message: 'Error 1', _id: '_errorId'}],
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/error/${errorId}`}]}>
      <Route
        path="/error/:errorId"
        params={{errorId}}>
        <DrawerProvider>
          <ErrorInfoDrawer {...props} />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
describe('ErrorInfoDrawer tests', () => {
  test('Should able to test the initial render with error', async () => {
    await initErrorInfoDrawer(props, '_errorId');
    expect(screen.getByRole('heading', {name: 'View error'})).toBeInTheDocument();
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Code')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getAllByRole('button').find(b => b.getAttribute('data-test') === 'cancelRevisonErrorInfo')).toBeInTheDocument();
  });
  test('Should able to test the initial render without error associated', async () => {
    await initErrorInfoDrawer(props, 'randomErrorId');
    expect(mockHistoryReplace).toHaveBeenCalledWith('/error/randomErrorId');
  });
});
