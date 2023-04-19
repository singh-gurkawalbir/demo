
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {renderWithProviders, mockGetRequestOnce} from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import actions from '../../../actions';
import FlowCharts from '.';

jest.mock('recharts', () => ({
  __esModule: true,
  ...jest.requireActual('recharts'),
  LineChart: props => (
    <>
      <div>
        LineChart
      </div>
      <div>
        {props.children}
      </div>
    </>
  ),
  Legend: props => {
    const payload = [{payload: {stroke: 'red'}, value: 123}];

    return (
      <>
        <div>
          Legend
        </div>
        <div>
          <props.content.type payload={payload} />
        </div>
      </>
    );
  },
  Line: props => {
    const opacity = `Opacity : ${props.strokeOpacity}`;

    if (props.name === 'auto-resolved') {
      return (
        <>
          <div>
            Line
          </div>
          <div>
            {opacity}
          </div>
          <div>
            <props.activeDot.type value={10} stroke="red" active idx={props.activeDot.props.idx} />
          </div>
        </>
      );
    }

    return null;
  },
  Tooltip: props => {
    const payload = [{name: 'name', value: 'nametext'}];

    return (
      <>
        <div>
          Tooltip
        </div>
        <div>
          <props.content.type payload={payload} label="2022-06-04T18:30:00.000Z" active />
        </div>
      </>
    );
  },
}));
const response =
  [
    {
      FIELD1: '',
      result: '_result',
      table: 0,
      _time: '2021-07-03T18:30:00Z',
      attribute: 'r',
      by: 'auto',
      flowId: '_integrationId',
      timeInMills: 1625337000000,
      type: 'sei',
      value: 0,
    },
  ];

async function flowRequest(store) {
  act(() => { store.dispatch(actions.resource.requestCollection('flows')); });
  await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
}

const props = { integrationId: '629f0dcfccb94d35de6f436b',
  selectedResources: ['629f0dcfccb94d35de6f436b'],
  range: {
    startDate: '2022-06-04T18:30:00.000Z',
    endDate: '2022-07-04T12:16:31.435Z',
    preset: 'last30days' }};

describe('flowChart(dashborad) UI tests', () => {
  runServer();

  async function renderFunction(props) {
    const {store} = renderWithProviders(<FlowCharts {...props} />);

    act(() => { store.dispatch(actions.user.profile.request()); });
    await waitFor(() => expect(store?.getState()?.user?.profile?.timezone).toBeDefined());

    return {store};
  }
  test('should test opacity', async () => {
    const {store} = await renderFunction(props);

    act(() => { store.dispatch(actions.flowMetrics.received('629f0dcfccb94d35de6f436b', response)); });
    const value = screen.getAllByText('123');
    const lastindex = value.length - 1;

    fireEvent.mouseEnter(value[lastindex]);
    await waitFor(() => expect(screen.getByText('Opacity : 0.2')).toBeInTheDocument());
    fireEvent.mouseLeave(screen.getAllByText('123')[lastindex]);
    expect(screen.queryByText('Opacity : 0.2')).not.toBeInTheDocument();
    expect(screen.getByText('Opacity : 1')).toBeInTheDocument();
  });
  test('should test Custom tooltip', async () => {
    await renderFunction(props);

    expect(screen.getAllByText('Tooltip')[0]).toBeInTheDocument();
    expect(screen.getAllByText('06/05/2022')[0]).toBeInTheDocument();
    expect(screen.getAllByText('name: nametext')[0]).toBeInTheDocument();
  });
  test('should run with an error', async () => {
    const {store} = await renderFunction({integrationId: '629f0dcfccb94d35de6f436b'});

    act(() => { store.dispatch(actions.flowMetrics.failed('629f0dcfccb94d35de6f436b')); });

    expect(screen.getByText('Error occured')).toBeInTheDocument();
  });
  test('should run with status loading', async () => {
    mockGetRequestOnce('/api/flows', [{
      _id: '606ec9a3ddb7577eb1af3cb4',
      lastModified: '2021-08-13T08:02:49.712Z',
      name: "'Permission Denied Error for QuickBooks Export 'JournalReport' from postman",
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
          _importId: '5e8098670f15e7611e7a6354',
        },
      ],
      pageGenerators: [
        {
          _exportId: '5d77c582c7a0a1744b85cc78',
          skipRetries: false,
        },
      ],
      createdAt: '2021-04-08T09:15:15.328Z',
      autoResolveMatchingTraceKeys: true,
    },
    ]);

    const {store} = await renderFunction({ integrationId: '5cc9bd00581ace2bec7754eb' });

    await flowRequest(store);
    act(() => { store.dispatch(actions.flowMetrics.request('integrations', '5cc9bd00581ace2bec7754eb', {})); });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
