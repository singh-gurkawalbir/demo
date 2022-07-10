/* global describe, test, expect,jest  */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RunFlowButton from '.';
import {renderWithProviders, mockGetRequestOnce} from '../../test/test-utils';
import { runServer } from '../../test/api/server';
import actions from '../../actions';

describe('RunflowComponent UI testing', () => {
  runServer();

  async function renderWithProps(props) {
    const {store} = renderWithProviders(<RunFlowButton {...props} />);

    store.dispatch(actions.resource.requestCollection('flows'));
    store.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());

    return {store};
  }

  test('should test run flow button for delta export ', async () => {
    const props = {
      flowId: '5f1535beef4fb87bc5e5fb3e',
      runOnMount: false,
    };

    mockGetRequestOnce('/api/flows/5f1535beef4fb87bc5e5fb3e/lastExportDateTime', {
      dateTime: '22/5/2022T16:14:12Z',
    });

    const {store} = await renderWithProps(props);
    const button = screen.getByRole('button');

    userEvent.click(button);
    await waitFor(() => expect(store?.getState()?.session.flows['5f1535beef4fb87bc5e5fb3e']).toBeDefined());
    const runflow = screen.getByText('Run');

    userEvent.click(runflow);

    expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
  });
  test('should test the cancel run flow button for delta export ', async () => {
    const props = {
      flowId: '5f1535beef4fb87bc5e5fb3e',
      runOnMount: false,
    };

    mockGetRequestOnce('/api/flows/5f1535beef4fb87bc5e5fb3e/lastExportDateTime', {
      dateTime: '22/5/2022T16:14:12Z',
    });

    const {store} = await renderWithProps(props);
    const button = screen.getByRole('button');

    userEvent.click(button);

    await waitFor(() => expect(store?.getState()?.session.flows['5f1535beef4fb87bc5e5fb3e']).toBeDefined());
    const cancelrunflow = screen.getByText('Cancel');

    userEvent.click(cancelrunflow);

    expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
  });
  test('should test for error api call ', async () => {
    const props = {
      flowId: '5f1535beef4fb87bc5e5fb3e',
      runOnMount: false,
    };

    const {store} = await renderWithProps(props);
    const button = screen.getByRole('button');

    userEvent.click(button);

    store.dispatch(actions.api.failure('/flows/5f1535beef4fb87bc5e5fb3e/lastExportDateTime', 'GET', 'error', false));
    store.dispatch(actions.flow.receivedLastExportDateTime('5f1535beef4fb87bc5e5fb3e'));
    expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
  });
  test('should test for simple import clicking run flow button here', async () => {
    const props = {
      flowId: '5ec6439006c2504f58943ec3',
      runOnMount: false,
    };
    const files = [
      new File(['hello'], 'hello.png', {type: 'image/png'}),
    ];

    const {store} = await renderWithProps(props);

    const input = screen.getByDisplayValue('');

    input.click = jest.fn();

    userEvent.upload(input, files);
    await waitFor(() => expect(input.files).toHaveLength(1));

    const m = Object.keys(store?.getState()?.session?.fileUpload);

    await waitFor(() => store?.getState()?.session?.fileUpload[m].status === 'received');

    const button = screen.getByRole('button');

    userEvent.click(button);
    expect(input.click).toHaveBeenCalled();
  });
  test('should test simple import clicking run now button here', async () => {
    const props = {
      flowId: '5ec6439006c2504f58943ec3',
      runOnMount: false,
      variant: 'iconText',
    };
    const files = [
      new File(['hello'], 'hello.png', {type: 'image/png'}),
    ];

    const {store} = await renderWithProps(props);

    const input = screen.getByDisplayValue('');

    input.click = jest.fn();

    userEvent.upload(input, files);
    await waitFor(() => expect(input.files).toHaveLength(1));

    const m = Object.keys(store?.getState()?.session?.fileUpload);

    await waitFor(() => store?.getState()?.session?.fileUpload[m].status === 'received');
    const button = screen.getByRole('button');

    userEvent.click(button);

    await waitFor(() => store?.getState()?.session?.flows.runStatus === 'started');
    expect(input.click).toHaveBeenCalledTimes(1);
  });
  test('should test simple import clicking Run flow button and different variant', async () => {
    const props = {
      flowId: '5ec6439006c2504f58943ec3',
      runOnMount: false,
      variant: 'some text',
    };
    const files = [
      new File(['hello'], 'hello.png', {type: 'image/png'}),
    ];

    const {store} = await renderWithProps(props);

    const input = screen.getByDisplayValue('');

    input.click = jest.fn();

    userEvent.upload(input, files);
    await waitFor(() => expect(input.files).toHaveLength(1));

    const m = Object.keys(store?.getState()?.session?.fileUpload);

    await waitFor(() => store?.getState()?.session?.fileUpload[m].status === 'received');
    const button = screen.getByText('Run flow');

    userEvent.click(button);
    expect(input.click).toHaveBeenCalledTimes(1);
  });
  test('should do test for simple export with pagegenerstor length =0 ', async () => {
    const props = {
      flowId: '5f0802e086bd7d4f42eadd0b',
      runOnMount: false,
      variant: 'iconText',
    };

    await renderWithProps(props);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
  });
});
