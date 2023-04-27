
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import ErrorCell from './ErrorCell';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';

let initialStore;

function initErrorCell({job, disabled}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '12345',
      name: 'Test integration name',
    }];
    draft.data.resources.flows = [{
      _id: '67890',
      name: 'Test flow name 1',
      _integrationId: '12345',
      disabled: false,
      pageProcessors: [
        {
          type: 'import',
          _importId: 'nxksnn',
        },
      ],
      pageGenerators: [
        {
          _exportId: 'xsjxks',
        },
      ],
    }];
    draft.data.resources.exports = [{
      _id: 'xsjxks',
      name: 'Test export',
      _integrationId: '12345',
    }];
    draft.data.resources.imports = [{
      _id: 'nxksnn',
      name: 'Test import',
      _integrationId: '12345',
    }];
  });
  const ui = (
    <MemoryRouter>
      <ErrorCell job={job} disabled={disabled} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('testsuite for ErrorCell', () => {
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
  test('should test the Error button when there are errors', async () => {
    const job = {
      _integrationId: '12345',
      _flowId: '67890',
      _flowJobId: '76543',
      _exportId: 'xsjxks',
      numOpenError: '1',
    };

    initErrorCell({job, disabled: false});
    const errorButtonNode = screen.getByRole('button', {name: '1 errors'});

    expect(errorButtonNode).toBeInTheDocument();
    expect(errorButtonNode).not.toBeDisabled();
    await userEvent.click(errorButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: '67890-76543-xsjxks',
      filter: {
        _integrationId: '12345',
        _flowId: '67890',
        _flowJobId: '76543',
        _exportId: 'xsjxks',
        numOpenError: '1',
      },
    });
  });
  test('should test the disabled Error button when there are errors', async () => {
    const job = {
      _integrationId: '12345',
      _flowId: '67890',
      _flowJobId: '76543',
      _exportId: 'xsjxks',
      numOpenError: '1',
    };

    initErrorCell({job, disabled: true});
    expect(screen.getByText(/1 errors/i)).toBeInTheDocument();
  });
  test('should test the enabled success button', async () => {
    const job = {
      _integrationId: '12345',
      _flowId: '67890',
      _flowJobId: '76543',
      _exportId: 'xsjxks',
    };

    initErrorCell({job, disabled: false});
    const successButtonNode = screen.getByRole('button', {name: 'Success'});

    expect(successButtonNode).toBeInTheDocument();
    expect(successButtonNode).not.toBeDisabled();
    await userEvent.click(successButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: '67890-76543-xsjxks',
      filter: {
        _integrationId: '12345',
        _flowId: '67890',
        _flowJobId: '76543',
        _exportId: 'xsjxks',
      },
    });
  });
  test('should test the disabled success button', async () => {
    const job = {
      _integrationId: '12345',
      _flowId: '67890',
      _flowJobId: '76543',
      _exportId: 'xsjxks',
    };

    initErrorCell({job, disabled: true});
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
  test('should test the Error button when there are 9999+ errors', async () => {
    const job = {
      _integrationId: '12345',
      _flowId: '67890',
      _flowJobId: '76543',
      _exportId: 'xsjxks',
      numOpenError: '10000',
    };

    initErrorCell({job, disabled: false});
    const errorButtonNode = screen.getByRole('button', {name: '9999+ errors'});

    expect(errorButtonNode).toBeInTheDocument();
    expect(errorButtonNode).not.toBeDisabled();
    await userEvent.click(errorButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'PATCH_FILTER',
      name: '67890-76543-xsjxks',
      filter: {
        _integrationId: '12345',
        _flowId: '67890',
        _flowJobId: '76543',
        _exportId: 'xsjxks',
        numOpenError: '10000',
      },
    });
  });
});

