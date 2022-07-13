/* global describe, test, expect ,jest */
import React from 'react';
import { screen, waitFor, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import ResourceFormWithStatusPanel from '.';
import actions from '../../actions';
import themeProvider from '../../theme/themeProvider';
import { runServer } from '../../test/api/server';
import {getCreatedStore} from '../../store';
import { SORT_GROUP_CONTENT_URL } from '../../utils/constants';

jest.mock('react-resize-detector', () => ({onResize}) => {
  onResize(1, 2);

  return (<></>);
});

const theme = themeProvider();

describe('test', () => {
  runServer();
  async function readyStore() {
    const store = getCreatedStore();

    store.dispatch(actions.resource.requestCollection('connections'));
    store.dispatch(actions.resource.requestCollection('imports'));
    store.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.imports).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());

    return {store};
  }

  function renderWithStoreAsndProps(store, props) {
    render(
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <MemoryRouter>
              <ResourceFormWithStatusPanel {...props} />
            </MemoryRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </Provider>);
  }
  test('testing for offline connection', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'connections',
      resourceId: '5e7068331c056a75e6df19b2',
      formKey: 'connections-5e7068331c056a75e6df19b2',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).toBeInTheDocument();
  });
  test('should test for online connection', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'connections',
      resourceId: '5e2557e8305adc5f80b6910e',
      formKey: 'connections-5e2557e8305adc5f80b6910e',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.queryByText('This connection is currently offline. Re-enter your credentials to bring it back online.');

    expect(message).not.toBeInTheDocument();
  });
  test('should test for depricated export', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'exports',
      resourceId: '52a196ce1bf5be58603a5417',
      formKey: 'exports-52a196ce1bf5be58603a5417',
      variant: 'edit',
    };

    renderWithStoreAsndProps(store, props);
    const message = screen.getByText('Learn more');

    expect(message).toBeInTheDocument();
    expect(message).toHaveAttribute('href', SORT_GROUP_CONTENT_URL);
  });
  test('should test for bundle install notification', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'exports',
      resourceId: '5e74798ec2c20f66f05cd370',
      formKey: 'exports-5e74798ec2c20f66f05cd370',
      occupyFullWidth: true,
    };

    renderWithStoreAsndProps(store, props);

    store.dispatch(actions.resourceForm.showBundleInstallNotification('1.0', '/', 'exports', '5e74798ec2c20f66f05cd370'));
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/');
  });
  test('should test for notification toaster', async () => {
    const {store} = await readyStore();
    const props = {
      className: 'makeStyles-resourceFormWrapper-250',
      flowId: undefined,
      isFlowBuilderView: false,
      isNew: false,
      resourceType: 'imports',
      resourceId: '5f2d839ff238932d6c7593f6',
      formKey: 'imports-52a196ce1bf5be58603a5417',
      variant: '',
      showNotificationToaster: true,

    };

    renderWithStoreAsndProps(store, props);
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Let us know to prioritize this');
    expect(link).toHaveAttribute('href', 'mailto:product_feedback@celigo.com');
  });
});
