
import { cleanup, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ChildJobDetail from './ChildJobDetail';
import { getCreatedStore } from '../../../store';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';

let initialStore;

function initChildJobDetail({job}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.exports = [
      {
        _id: 12345,
        name: 'Test Export',
      },
    ];
    draft.data.resources.imports = [
      {
        _id: 23456,
        name: 'Test Import',
      },
      {
        _id: 34567,
      },
    ];
  });
  const ui = (
    <MemoryRouter>
      <ChildJobDetail job={job} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  TimeAgo: props => (
    <div>{props.date}</div>
  ),
}));
jest.mock('../../../utils/errorManagement', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/errorManagement'),
  getJobDuration: jest.fn().mockReturnValue('testing duration'),
}));
describe('testsuite for ChildJobDetail', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  afterEach(() => {
    cleanup();
  });
  test('should render the export job details', async () => {
    const job = {
      type: 'export',
      _exportId: 12345,
      name: 'Test Export',
      startedAt: 'testing started at',
      endedAt: 'testing ended at',
      numSuccess: 1,
      numIgnore: 1,
      numPagesGenerated: 1,
    };

    initChildJobDetail({job});
    expect(screen.getByText(/Test Export/i)).toBeInTheDocument();
    expect(screen.getByText(/testing duration/i)).toBeInTheDocument();
    expect(screen.getByText(/testing started at/i)).toBeInTheDocument();
    expect(screen.getByText(/testing ended at/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
  test('should render the import job details when name is not provided in the jobs and should extract the import name from store', async () => {
    const job = {
      type: 'import',
      _importId: 23456,
      startedAt: 'testing started at',
      endedAt: 'testing ended at',
      numSuccess: 1,
      numIgnore: 1,
      numPagesProcessed: 1,
    };

    initChildJobDetail({job});
    expect(screen.getByText(/Test Import/i)).toBeInTheDocument();
    expect(screen.getByText(/testing duration/i)).toBeInTheDocument();
    expect(screen.getByText(/testing started at/i)).toBeInTheDocument();
    expect(screen.getByText(/testing ended at/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
  test('should render the import job details when name is not provided in the jobs and should extract the import type from store', async () => {
    const job = {
      type: 'import',
      _importId: 34567,
      startedAt: 'testing started at',
      endedAt: 'testing ended at',
      numSuccess: 1,
      numIgnore: 1,
      numPagesProcessed: 1,
    };

    initChildJobDetail({job});
    expect(screen.getByText(/import/i)).toBeInTheDocument();
    expect(screen.getByText(/testing duration/i)).toBeInTheDocument();
    expect(screen.getByText(/testing started at/i)).toBeInTheDocument();
    expect(screen.getByText(/testing ended at/i)).toBeInTheDocument();
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
