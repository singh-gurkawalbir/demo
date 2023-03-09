
import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import useOpenRevisionWhenValid from './useOpenRevisionWhenValid';

const mockHistoryReplace = jest.fn();
const mockHistoryPush = jest.fn();
const props = { integrationId: '_integrationId', drawerURL: '/drawerURL' };

const MockComponent = props => {
  const handleRevisionOpen = useOpenRevisionWhenValid(props);

  return <button type="button" onClick={handleRevisionOpen}> Open</button>;
};

async function inituseOpenRevisionWhenValid(props = {}, revisionInProgress = false) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.revisions = {
      _integrationId: {
        data: [{_id: '_revId', status: revisionInProgress ? 'inprogress' : 'completed'}],
      },
    };
  });

  return renderWithProviders(<MockComponent {...props} />, {initialStore});
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
    push: mockHistoryPush,
  }),
}));
describe('useOpenRevisionWhenValid tests', () => {
  afterEach(() => {
    mockHistoryReplace.mockClear();
    mockHistoryPush.mockClear();
  });
  test('Should able to test the hook without any revision inProgress and is not a pull and without drawerURL', async () => {
    await inituseOpenRevisionWhenValid({...props, drawerURL: ''});
    const openBtn = screen.getByRole('button', {name: 'Open'});

    expect(openBtn).toBeInTheDocument();
    await userEvent.click(openBtn);
    expect(mockHistoryPush).not.toHaveBeenCalledWith('/drawerURL');
  });
  test('Should able to test the hook without any revision inProgress and is not a pull', async () => {
    await inituseOpenRevisionWhenValid(props);
    await userEvent.click(screen.getByRole('button', {name: 'Open'}));
    expect(mockHistoryPush).toHaveBeenCalledWith('/drawerURL');
  });
  test('Should able to test the hook with isCreatePull true and not having any clone family', async () => {
    await inituseOpenRevisionWhenValid({...props, isCreatePull: true});
    await userEvent.click(screen.getByRole('button', {name: 'Open'}));
    expect(mockHistoryPush).not.toHaveBeenCalledWith('/drawerURL');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByText('You don\'t have any data to pull. Learn more about')).toBeInTheDocument();
    expect(screen.getByText('cloning and pulling your integrations.')).toBeInTheDocument();
  });
  test('Should able to test the hook with revision inProgress', async () => {
    await inituseOpenRevisionWhenValid(props, true);
    await userEvent.click(screen.getByRole('button', {name: 'Open'}));
    expect(mockHistoryPush).not.toHaveBeenCalledWith('/drawerURL');
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('You have a pull, snapshot, or revert in progress.')).toBeInTheDocument();
  });
});
