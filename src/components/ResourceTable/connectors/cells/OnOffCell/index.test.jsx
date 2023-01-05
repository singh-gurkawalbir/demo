
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import {
  renderWithProviders,
  reduxStore,
} from '../../../../../test/test-utils';
import OnOffCell from '.';
import { ConfirmDialogProvider } from '../../../../ConfirmDialog';
import actions from '../../../../../actions';

const initialStore = reduxStore;

initialStore.getState().session.connectors = [];
initialStore.getState().session.connectors['2345678'] = {
  publishStatus: 'loading',
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
describe('uI test cases for OnOffCell', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('should show empty DOM', () => {
    const { utils } = renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell />
      </ConfirmDialogProvider>
    );

    expect(utils.container.textContent).toBe('');
  });
  test('should display unpublish button', () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell
          connectorId="2345678"
          published
          applications={['netsuite', 'magento']}
          resourceType="connectors"
        />
      </ConfirmDialogProvider>
    );
    const checkBoxButton = screen.getByRole('checkbox');

    expect(checkBoxButton).toBeInTheDocument();
    userEvent.click(checkBoxButton);
    const unPublishButton = screen.getByText('Unpublish');

    expect(unPublishButton).toBeInTheDocument();
    userEvent.click(unPublishButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.connectors.publish.request('2345678', true)
    );
  });

  test('should display publish button', () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell
          connectorId="2345678"
          published={false}
          applications={['netsuite', 'magento']}
          resourceType="connectors"
        />
      </ConfirmDialogProvider>
    );
    const checkBoxButton = screen.getByRole('checkbox');

    expect(checkBoxButton).toBeInTheDocument();
    userEvent.click(checkBoxButton);
    const publishButton = screen.getByText('Publish');

    expect(publishButton).toBeInTheDocument();
    userEvent.click(publishButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.connectors.publish.request('2345678', false)
    );
  });
  test('should display the cancel button', () => {
    renderWithProviders(
      <ConfirmDialogProvider>
        <OnOffCell
          published={false}
          applications={['netsuite', 'magento']}
          resourceType="connectors"
        />
      </ConfirmDialogProvider>
    );
    const checkBoxButton = screen.getByRole('checkbox');

    expect(checkBoxButton).toBeInTheDocument();
    userEvent.click(checkBoxButton);
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
  });
  test('should display toggle status as loading', () => {
    renderWithProviders(
      <OnOffCell
        connectorId="2345678"
        published
        applications={['netsuite', 'magento']}
        resourceType="connectors"
        />,
      { initialStore }
    );
    const response = screen.getByRole('progressbar');

    expect(response).toBeInTheDocument();
  });
});
