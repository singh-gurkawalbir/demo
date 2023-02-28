
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import PreviewTable from './PreviewTable';

async function initPreviewTable(props = {}, data = {}, status = 'success') {
  const initialStore = reduxStore;
  const components = data.model ? { objects: [data]} : undefined;

  mutateStore(initialStore, draft => {
    draft.session.templates = {
      _templateId:
        {
          preview: {
            status,
            components,
          },
        },
    };
  });

  const ui = (
    <MemoryRouter>
      <PreviewTable {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}
describe('PreviewTable tests', () => {
  test('Should able to test the initial render with PreviewTable without Data', async () => {
    await initPreviewTable({templateId: '_templateId'});
    expect(screen.getByRole('button', {name: 'Flows'})).toBeInTheDocument();
    expect(document.querySelectorAll('th')[0].innerHTML).toBe('Name');
    expect(document.querySelectorAll('th')[1].innerHTML).toBe('Description');
  });

  test('Should able to test the PreviewTable with normal Data', async () => {
    await initPreviewTable({templateId: '_templateId'}, {model: 'Flow', doc: {_id: '_id'}});
    expect(screen.getByRole('button', {name: 'Flows'})).toBeInTheDocument();
    expect(screen.getByText('_id')).toBeInTheDocument();
  });
  test('Should able to test the PreviewTable with EmptyMessage in Script resourceType', async () => {
    await initPreviewTable({templateId: '_templateId'}, {model: 'Script', emptyMessage: 'Some empty message'});
    expect(screen.getByRole('button', {name: 'Scripts'})).toBeInTheDocument();
    expect(screen.getAllByText('Name')).toHaveLength(2);
    expect(screen.getByText('Some empty message')).toBeInTheDocument();
  });
  test('Should able to test the PreviewTable with GroupName in Connections resourceType', async () => {
    await initPreviewTable({templateId: '_templateId'}, {model: 'Connection', groupName: '_GroupName'});
    expect(screen.getByRole('button', {name: 'Connections'})).toBeInTheDocument();
    expect(screen.getAllByText('Name')).toHaveLength(2);
  });
  test('Should able to test the PreviewTable with status = failure', async () => {
    await initPreviewTable({templateId: '_templateId'}, {}, 'failure');
    expect(screen.queryByText('Flows')).not.toBeInTheDocument();
  });
  test('Should able to test the PreviewTable with status = requested', async () => {
    await initPreviewTable({templateId: '_templateId'}, {}, 'requested');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Flows')).not.toBeInTheDocument();
  });
});

