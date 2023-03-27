import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ErrorPanel from './errorPanel';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';

let initialStore;

async function initErrorPanel({resourceId, data} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.resourceFormSampleData[resourceId] = data;
  });
  const ui = (
    <MemoryRouter>
      <ErrorPanel resourceId={resourceId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../CeligoTabLayout/CustomPanels/DefaultPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../../CeligoTabLayout/CustomPanels/DefaultPanel'),
  default: () => (
    <div>Testing Default Panel</div>
  ),
}
));

describe('testsuite for Error Panel', () => {
  runServer();
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('Should test the error panel when there is response data and no parse data/error to show', async () => {
    await initErrorPanel({resourceId: '12345',
      data: {
        preview: {
          status: 'error',
          data: {
            request: [
              {
                headers: {
                  accept: 'application/json',
                },
              },
            ],
            raw: [
              {
                headers: {
                  'content-type': 'application/json; charset=utf-8',
                },
                body: '{"error":"InvalidEndpoint","description":"Not found"}',
              },
            ],
          },
        },
      },
    });
    expect(screen.getByText(/no data to show - application responded with an error/i)).toBeInTheDocument();
  });
  test('should test the error panel when there is data', async () => {
    await initErrorPanel({resourceId: '12345',
      data: {
        preview: {
          status: 'error',
          data: {
            parse: {
              errors: {
                error2: 'testng error panel',
              },
            },
          },
        },
      }});
    expect(screen.getByText(/Testing Default Panel/i)).toBeInTheDocument();
  });
});
