
import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {renderWithProviders} from '../../../test/test-utils';
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
    const payload = [{name: 'name', value: 'nametext'}, {name: 'name2', value: 'nametext2'}];

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
  XAxis: props => {
    const domain = `${props.domain[0]} , ${props.domain[1]}`;

    return (
      <>
        <div>
          XAxis
        </div>
        <div>
          {domain}
        </div>
      </>
    );
  },
}));

const props = {
  flowId: '629f0dcfccb94d35de6f436b',
  selectedResources: ['629f0dcfccb94d35de6f436b'],
  range: {
    startDate: '2022-06-04T18:30:00.000Z',
    endDate: '2022-07-04T12:16:31.435Z',
    preset: 'last30days',
  },
};

describe('flowChart UI Tests', () => {
  runServer();

  async function renderWithProps(props) {
    const {store} = renderWithProviders(<FlowCharts
      {...props} />);

    act(() => { store.dispatch(actions.user.profile.request()); });
    await waitFor(() => expect(store?.getState()?.user?.profile?.timezone).toBeDefined());

    return store;
  }
  test('should do the testing when flow is loading', async () => {
    const store = await renderWithProps(props);

    act(() => {
      store.dispatch(actions.flowMetrics.request(
        'flows',
        '629f0dcfccb94d35de6f436b',
        { range: {
          startDate: '2022-06-04T18:30:00.000Z',
          endDate: '2022-07-04T12:16:31.435Z',
          preset: 'last30days',
        },
        selectedResources: ['629f0dcfccb94d35de6f436b'] }));
    });

    await expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should test opacity', async () => {
    const store = await renderWithProps(props);

    act(() => { store.dispatch(actions.flowMetrics.received('629f0dcfccb94d35de6f436b', [])); });
    const value = await waitFor(() => screen.getAllByText('123'));
    const lastindex = value.length - 1;

    await fireEvent.mouseEnter(value[lastindex]);
    await waitFor(() => expect(screen.getByText('Opacity : 0.2')).toBeInTheDocument());
    await fireEvent.mouseLeave(screen.getAllByText('123')[lastindex]);
    expect(screen.queryByText('Opacity : 0.2')).not.toBeInTheDocument();
    expect(screen.getByText('Opacity : 1')).toBeInTheDocument();
  });

  test('should test Custom tooltip', async () => {
    const store = await renderWithProps(props);

    act(() => { store.dispatch(actions.flowMetrics.received('629f0dcfccb94d35de6f436b', [])); });
    await waitFor(() => expect(screen.getAllByText('Tooltip')[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByText('06/05/2022')[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByText('name: nametext')[0]).toBeInTheDocument());
  });
  test('should run with an error', async () => {
    const store = await renderWithProps(props);

    act(() => { store.dispatch(actions.flowMetrics.failed('629f0dcfccb94d35de6f436b')); });

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });
  test('should test last run condition', async () => {
    const props = {
      flowId: '629f0dcfccb94d35de6f436b',
      selectedResources: ['629f0dcfccb94d35de6f436b'],
      range: {
        startDate: '2022-06-04T18:30:00.000Z',
        endDate: '2022-07-04T12:16:31.435Z',
        preset: 'lastrun',
      },
    };
    const store = await renderWithProps(props);

    act(() => {
      store.dispatch(actions.flowMetrics.received('629f0dcfccb94d35de6f436b', {
        lastRun: {
          startDate: '2022-010-10T18:30:00.000Z',
          endDate: '2022-011-10T12:16:31.435Z',
        },
        FIELD1: '',
        result: '_result',
        table: 0,
        _time: '2021-08-31T18:30:00Z',
        attribute: 's',
        by: '',
        flowId: '629f0dcfccb94d35de6f436b',
        timeInMills: 1630434600000,
        type: 'sei',
        value: 0,
      }));
    });
    await waitFor(() => expect(screen.getAllByText('1656936991435 , 1656936991435')[0]).toBeInTheDocument());
  });
});
