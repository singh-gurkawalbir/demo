
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import RunFlowButton from '.';
import {renderWithProviders, mockGetRequestOnce, mutateStore} from '../../test/test-utils';
import {getCreatedStore} from '../../store';

const flows = [
  {
    _id: '5f0802e086bd7d4f42eadd0b',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: "'Permission Denied Error for QuickBooks Export 'JournalReport'",
    disabled: false,
    _integrationId: '5ff579d745ceef7dcd797c15',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5e8098670f15e7611e7a6354',
      },
    ],
    pageGenerators: [
      {
        _exportId: '62a196ce1bf5be58603a5416',
        skipRetries: false,
      },
    ],
    createdAt: '2020-07-10T05:55:44.464Z',
    lastExecutedAt: '2020-07-20T10:30:22.111Z',
    autoResolveMatchingTraceKeys: true,
  },
  {
    _id: '5ec6439006c2504f58943ec3',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: '943 Return Authorization Flow - RHF0000790',
    disabled: false,
    _integrationId: '5cc9bd00581ace2bec7754eb',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5ec6460a06c2504f58943f1a',
      },
    ],
    pageGenerators: [
      {
        _exportId: '629f0db3ccb94d35de6f4367',
      },
    ],
    createdAt: '2020-05-21T09:02:08.944Z',
    wizardState: 'done',
    lastExecutedAt: '2020-05-21T11:05:38.927Z',
    autoResolveMatchingTraceKeys: true,
  },
];

const deltaFlow = [
  {
    _id: '5f1535beef4fb87bc5e5fb3e',
    lastModified: '2021-04-16T07:29:37.830Z',
    name: '91. Orders - Magento to Stage - Single Order',
    disabled: false,
    _integrationId: '5cc9bd00581ace2bec7754eb',
    skipRetries: false,
    _exportId: '5c9b5d5646fc7429c2a405fa',
    _importId: '5c9b5d5646fc7429c2a40234',
    pageGenerators: ['1'],
    routers: ['1'],
    createdAt: '2020-07-20T06:12:14.256Z',
    lastExecutedAt: '2020-07-30T13:06:07.325Z',
  },
];

const exports = [
  {
    _id: '629f0db3ccb94d35de6f4367',
    createdAt: '2022-06-07T08:34:59.858Z',
    lastModified: '2022-06-07T08:35:00.020Z',
    name: 'Any',
    _connectionId: '629f0d8accb94d35de6f4363',
    apiIdentifier: 'e1004e644e',
    asynchronous: true,
    type: 'simple',
    oneToMany: false,
    sandbox: false,
    parsers: [],
    http: {
      relativeURI: '/test',
      method: 'GET',
      formType: 'http',
    },
    test: {
      limit: 1,
    },
    adaptorType: 'HTTPExport',
  },
];
const deltaExports = [
  {
    _id: '5c9b5d5646fc7429c2a405fa',
    createdAt: '2019-03-27T11:24:06.069Z',
    lastModified: '2021-11-15T06:17:42.689Z',
    name: 'Amazon (FBA) List Orders Export Adaptor',
    _connectionId: '5c9b5bfb46fc7429c2a40508',
    _integrationId: '5c9b5bfaccf55e2a5c140233',
    _connectorId: '58777a2b1008fb325e6c0953',
    externalId: 'amazon_fba_list_orders_export_adaptor',
    apiIdentifier: 'eef1268f7a',
    asynchronous: true,
    type: 'delta',
    adaptorType: 'HTTPExport',
  },
];

describe('runflowComponent UI testing', () => {
  async function renderWithProps(props) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.flows = flows;
      draft.data.resources.exports = exports;
    });

    const {store} = renderWithProviders(<RunFlowButton {...props} />, {initialStore});

    return {store};
  }
  describe('tests for delta flows', () => {
    async function renderFunction(props, status) {
      const initialStore = getCreatedStore();

      mutateStore(initialStore, draft => {
        draft.data.resources.exports = deltaExports;
        draft.data.resources.flows = deltaFlow;
      });

      if (status) {
        mutateStore(initialStore, draft => {
          draft.session.flows['5f1535beef4fb87bc5e5fb3e'] = { lastExportDateTime: { status } };
        });
      }

      const {store} = renderWithProviders(<RunFlowButton {...props} />, {initialStore});

      return {store};
    }
    test('should test run flow button for delta flows', async () => {
      const props = {
        flowId: '5f1535beef4fb87bc5e5fb3e',
        runOnMount: false,
      };

      await renderFunction(props, true);

      waitFor(async () => {
        const button = screen.getByRole('button');

        await userEvent.click(button);
      });

      waitFor(async () => {
        const runflow = screen.getByText('Run');

        await userEvent.click(runflow);

        expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
      });
    });
    test('should test the cancel run flow button for delta export', async () => {
      const props = {
        flowId: '5f1535beef4fb87bc5e5fb3e',
        runOnMount: false,
      };

      mockGetRequestOnce('/api/flows/5f1535beef4fb87bc5e5fb3e/lastExportDateTime', {
        dateTime: '22/5/2022T16:14:12Z',
      });

      await renderFunction(props, 'received');

      waitFor(async () => {
        const button = screen.getByRole('button');

        await userEvent.click(button);
      });
      let cancelrunflow;

      waitFor(async () => {
        cancelrunflow = screen.getByText('Cancel');
      });

      waitFor(async () => {
        await userEvent.click(cancelrunflow);

        expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
      });
    });
    test('should test for error api call', async () => {
      const props = {
        flowId: '5f1535beef4fb87bc5e5fb3e',
        runOnMount: false,
      };

      await renderFunction(props, 'error');
      waitFor(async () => {
        const button = screen.getByRole('button');

        await userEvent.click(button);

        expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
      });
    });
    test('should test for error api call duplicate', async () => {
      const props = {
        flowId: '5f1535beef4fb87bc5e5fb3e',
        runOnMount: false,
      };

      await renderFunction(props, 'error');
      waitFor(async () => {
        const button = screen.getByRole('button');

        await userEvent.click(button);

        expect(screen.queryByText('Delta flow')).not.toBeInTheDocument();
      });
    });
    test('should test when status is none', async () => {
      const props = {
        flowId: '5f1535beef4fb87bc5e5fb3e',
        runOnMount: false,
      };

      await renderFunction(props);
      waitFor(async () => {
        const button = screen.getByRole('button');

        await userEvent.click(button);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });
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

    let input;

    waitFor(() => {
      input = screen.getByDisplayValue('');

      jest.spyOn(input, 'click').mockImplementation();

      // userEvent.upload(input, files);
      fireEvent.change(input, { target: { files: { item: () => files, length: 1, 0: files } } });
      expect(input.files).toHaveLength(1);

      const m = Object.keys(store?.getState()?.session?.fileUpload);

   store?.getState()?.session?.fileUpload[m].status === 'received';
    });
    let button;

    waitFor(async () => {
      button = screen.getByRole('button');

      await userEvent.click(button);
      expect(input.click).toHaveBeenCalled();
    });
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
    let input;

    waitFor(async () => { input = screen.getByDisplayValue(''); });

    jest.spyOn(input, 'click').mockImplementation();

    // userEvent.upload(input, files);
    fireEvent.change(input, { target: { files: { item: () => files, length: 1, 0: files } } });
    await waitFor(() => expect(input.files).toHaveLength(1));

    const m = Object.keys(store?.getState()?.session?.fileUpload);

    await waitFor(() => store?.getState()?.session?.fileUpload[m].status === 'received');
    let button;

    waitFor(() => { button = screen.getByRole('button'); });

    waitFor(async () => { await userEvent.click(button); });

    waitFor(() => {
      store?.getState()?.session?.flows.runStatus === 'started';
      expect(input.click).toHaveBeenCalledTimes(1);
    });
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

    jest.spyOn(input, 'click').mockImplementation();

    // userEvent.upload(input, files);
    fireEvent.change(input, { target: { files: { item: () => files, length: 1, 0: files } } });
    await waitFor(() => expect(input.files).toHaveLength(1));

    const m = Object.keys(store?.getState()?.session?.fileUpload);

    await waitFor(() => store?.getState()?.session?.fileUpload[m].status === 'received');
    let button;

    waitFor(async () => {
      button = screen.getByText('Run flow');
    });

    waitFor(async () => {
      await userEvent.click(button);
      expect(input.click).toHaveBeenCalledTimes(1);
    });
  });
  test('should do test for simple export with pagegenerator length = 0', async () => {
    const mockDispatch = jest.fn();

    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
    const props = {
      flowId: '5f0802e086bd7d4f42eadd0b',
      runOnMount: false,
      variant: 'iconText',
    };

    await renderWithProps(props);

    waitFor(async () => {
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
      await userEvent.click(button);
      expect(mockDispatch).toHaveBeenCalledWith(
        {
          type: 'FLOW_RUN',
          flowId: '5f0802e086bd7d4f42eadd0b',
          customStartDate: undefined,
          options: undefined,
        }
      );
    });
  });
  test('should do test for on rum mount', async () => {
    const mockDispatch = jest.fn();

    jest.spyOn(redux, 'useDispatch').mockReturnValue(mockDispatch);
    const props = {
      flowId: '5f0802e086bd7d4f42eadd0b',
      runOnMount: true,
      variant: 'iconText',
    };

    await renderWithProps(props);
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'FLOW_RUN',
        flowId: '5f0802e086bd7d4f42eadd0b',
        customStartDate: undefined,
        options: undefined,
      }
    );
  });
});
