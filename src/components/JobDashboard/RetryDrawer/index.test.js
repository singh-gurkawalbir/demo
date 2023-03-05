
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import RetryDrawer from '.';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import { runServer } from '../../../test/api/server';

let initialStore;

async function initRetryDawer({height, jobId, flowJobId, retryId, retryData}) {
  mutateStore(initialStore, draft => {
    draft.data.jobs.retryObjects[retryId] = {
      retryData,
    };
  });
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/integrations/1234/dashboard/viewErrors/editRetry/${retryId}`}]}
    >
      <Route
        path="/integrations/1234/dashboard/viewErrors/editRetry/:retryId"
        params={{ retryId: `${retryId}`}}
      >
        <RetryDrawer height={height} jobId={jobId} flowJobId={flowJobId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
let mockHistoryPush;
let mockHistoryGoBack;

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    goBack: mockHistoryGoBack,
  }),
}));
jest.mock('../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right/DrawerHeader'),
  default: () => (
    <>
      Edit retry data
    </>
  ),
}));
jest.mock('../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../CodeEditor'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <>
        <textarea name="codeEditor" data-test="code-editor" value={value} onChange={handleChange} />
      </>
    );
  },
}
));
describe('testsuite for Retry Drawer', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should test the retry drawer by modifying the JSON content and verify the save button', async () => {
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543',
      retryData: {
        data: {
          id: '123',
          name: 'test',
        },
      }});
    expect(screen.getByText(/edit retry data/i)).toBeInTheDocument();
    const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(textBoxNode).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('{"id":"123","name":"test"}');
    await fireEvent.change(textBoxNode, {target: {value: '{"id":"123"}'}});
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('{"id":"123"}');
    const saveButtonNode = screen.getByRole('button', {name: 'Save'});

    expect(saveButtonNode).toBeInTheDocument();
    await userEvent.click(saveButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'JOB_ERROR_UPDATE_RETRY_DATA',
      retryData: { data: { id: '123' } },
      retryId: '6543',
      asyncKey: 'retryDrawer-0987-7654',
    });
  });
  test('should test the retry drawer by modifying the JSON content and verify the save and close button', async () => {
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543',
      retryData: {
        data: {
          id: '123',
          name: 'test',
        },
      }});
    waitFor(async () => {
      const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

      expect(textBoxNode).toBeInTheDocument();
      expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('{"id":"123","name":"test"}');
      await fireEvent.change(textBoxNode, {target: {value: '{"id":"123"}'}});
      expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('{"id":"123"}');
    });
    waitFor(async () => {
      const saveAndCloseButtonNode = screen.getByRole('button', {name: 'Save & close'});

      expect(saveAndCloseButtonNode).toBeInTheDocument();
      await userEvent.click(saveAndCloseButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'JOB_ERROR_UPDATE_RETRY_DATA',
        retryData: { data: { id: '123' } },
        retryId: '6543',
        asyncKey: 'retryDrawer-0987-7654',
      });
    });
  });
  test('should load the retry drawer with JSON content and click on close button', async () => {
    mockHistoryGoBack = jest.fn();
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543',
      retryData: {
        data: {
          id: '123',
          name: 'test',
        },
      }});
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    waitFor(async () => {
      const closeButtonNode = screen.getByRole('button', {name: 'Close'});

      expect(closeButtonNode).toBeInTheDocument();
      await userEvent.click(closeButtonNode);
      expect(mockHistoryGoBack).toHaveBeenCalled();
      mockHistoryGoBack.mockClear();
    });
  });
  test('should load the retry drawer with JSON content and click on retry button and the save button should be in disabled state', async () => {
    mockHistoryGoBack = jest.fn();
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543',
      retryData: {
        data: {
          id: '123',
          name: 'test',
        },
      }});
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
    waitFor(async () => {
      const retryButtonNode = screen.getByRole('button', {name: 'Retry'});

      expect(retryButtonNode).toBeInTheDocument();
      await userEvent.click(retryButtonNode);
      expect(mockDispatchFn).toHaveBeenCalledWith({
        type: 'JOB_ERROR_RETRY_SELECTED',
        jobId: '0987',
        flowJobId: '7654',
        selectedRetryIds: ['6543'],
        match: {
          path: '/integrations/1234/dashboard/viewErrors/editRetry/:retryId',
          url: '/integrations/1234/dashboard/viewErrors/editRetry/6543',
          isExact: true,
          params: { retryId: '6543' },
        },
      });
      expect(mockHistoryGoBack).toHaveBeenCalled();
      mockHistoryGoBack.mockClear();
    });
  });
  test('should load the retry drawer by modifying incorrect JSON content and verify the warning message and verify the retry and close button is in disabled state', async () => {
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543',
      retryData: {
        data: {
          id: '123',
          name: 'test',
        },
      }});
    expect(screen.getByText(/edit retry data/i)).toBeInTheDocument();
    waitFor(async () => {
      const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

      expect(textBoxNode).toBeInTheDocument();
      expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveValue('{"id":"123","name":"test"}');
      await fireEvent.change(textBoxNode, {target: {value: 'test'}});
      expect(screen.getByText(/Your retry data is not a valid JSON object./i)).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
      expect(screen.getByRole('button', {name: 'Retry'})).toBeDisabled();
    });
  });
  test('should load the retry drawer with no data', async () => {
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654',
      retryId: '6543'});
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'JOB_ERROR_REQUEST_RETRY_DATA', retryId: '6543' });
  });
  test('should load the retry drawer with no retryId and with no data', async () => {
    await initRetryDawer({height: 'tall',
      jobId: '0987',
      flowJobId: '7654'});
    expect(screen.getByRole('progressbar').className).toEqual(expect.stringContaining('MuiCircularProgress-'));
  });
});

