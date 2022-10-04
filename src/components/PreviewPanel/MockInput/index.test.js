/* global describe, test, jest, beforeEach, afterEach, expect */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import MockInput from '.';
import { getCreatedStore } from '../../../store';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

let initialStore;

async function initMockInput({flowId = '12345', formKey = 'imports-98765', resourceType = 'imports', resourceId = '98765', data, flowData} = {}) {
  initialStore.getState().session.resourceFormSampleData[resourceId] = data;
  initialStore.getState().session.flowData[flowId] = {
    pageProcessorsMap: {
    },
  };
  initialStore.getState().session.flowData[flowId].pageProcessorsMap[resourceId] = flowData;
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/integrations/654321/flowBuilder/12345/edit/imports/98765/inputData'}]}
    >
      <Route
        path="/integrations/654321/flowBuilder/12345/edit/imports/98765"
        url="/integrations/654321/flowBuilder/12345/edit/imports/98765"
      >
        <MockInput flowId={flowId} formKey={formKey} resourceType={resourceType} resourceId={resourceId} />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockHistoryReplace = jest.fn();
const mockHistorygoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
    goBack: mockHistorygoBack,
  }),
}));

jest.mock('../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right'),
  default: newprops => (
    <div>{newprops.children}</div>
  ),
}
));
jest.mock('../../drawer/Right/DrawerHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../drawer/Right/DrawerHeader'),
  default: () => (
    <div>Header</div>
  ),
}
));
jest.mock('../../AFE/Editor/panels/Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../AFE/Editor/panels/Code'),
  default: props => {
    if (!props.value.page_of_records) {
      return <div>Value not provided</div>;
    }

    return (
      <>
        <div>
          <textarea value={JSON.stringify(props.value)} onChange={props.onChange} />
        </div>
      </>
    );
  },
}
));
describe('Testsuite for MockInput', () => {
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
    mockDispatchFn.mockClear();
  });
  test.skip('should edit the JSON code with an valid JSON click on done message', async () => {
    await initMockInput({data: {
      preview: {
        status: 'received',
        recordSize: 10,
        data: {
          request: [
            {
              headers: {
                accept: 'application/json',
              },
              url: 'https://testapi.com',
              method: 'POST',
              body: {
                id: '123',
              },
            },
          ],
          mockData: true,
        },
      },
      typeOfSampleData: 'preview',
    },
    flowData: {
      preMap: {
        status: 'received',
        data: {
          id: '123',
        },
      },
      processedFlowInput: {
        status: 'received',
        data: {
          id: '123',
        },
      },
      flowInput: {
        status: 'received',
        data: {
          id: '123',
        },
      },
    },
    });
    expect(screen.getByText(/Header/i)).toBeInTheDocument();
    expect(screen.getByText(/input/i)).toBeInTheDocument();
    // userEvent.type(screen.getByText(/123/i), 'test');
    // expect(screen.getByText(/Mock input must contain page_of_records/i)).toBeInTheDocument();
    // const doneButtonNode = screen.getByRole('button', {name: 'Done'});

    // expect(doneButtonNode).toBeInTheDocument();
    // expect(doneButtonNode).toBeDisabled();
    screen.debug(null, Infinity);
  });
  test('should edit the JSON code with an empty JSON and verify the error message', async () => {
    await initMockInput({data: {
      preview: {
        status: 'received',
        recordSize: 10,
        data: {
          request: [
            {
              headers: {
                accept: 'application/json',
              },
              url: 'https://testapi.com',
              method: 'POST',
              body: {
                id: '123',
              },
            },
          ],
          mockData: true,
        },
      },
      typeOfSampleData: 'preview',
    },
    flowData: {
      preMap: {
        status: 'received',
        data: {
          id: '123',
        },
      },
      processedFlowInput: {
        status: 'received',
        data: {
          id: '123',
        },
      },
      flowInput: {
        status: 'received',
        data: {
          id: '123',
        },
      },
    },
    });
    const jsonNode = screen.getByText('{"page_of_records":[{"record":{"id":"123"}}]}');

    expect(jsonNode).toBeInTheDocument();
    userEvent.clear(jsonNode);
    expect(screen.getByText(/Value not provided/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock input must contain page_of_records/)).toBeInTheDocument();
  });
});

