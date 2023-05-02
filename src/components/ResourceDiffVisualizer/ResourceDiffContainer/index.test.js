
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import ResourceDiffContainer from '.';
import { getCreatedStore } from '../../../store';

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => (<div data-testid="spinner" />),
}));

function initResourceDiffContainer(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <ResourceDiffContainer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Test suite for ResourceDiffContainer component', () => {
  test('should render the resource name and titles in proper casing', () => {
    const props = {
      titles: { before: 'Before Merging', after: 'After Merging' },
      diff: [
        {
          resourceId: 'import123',
          action: 'new',
          after: {
            _connectionId: 'conn.new',
            name: 'New Import',
          },
        },
      ],
      resourceType: 'import',
      integrationId: 'int123',
    };

    initResourceDiffContainer(props);
    expect(screen.queryByText('References')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Imports'})).toBeInTheDocument();

    const containerTitles = Array.from(document.querySelectorAll('p')).map(ele => ele.textContent.trim());
    const diffTitles = Array.from(document.querySelectorAll('td')).map(ele => ele.textContent.trim());

    expect(containerTitles).toEqual([
      props.diff[0].after.name,
      'Action: New',
    ]);
    expect(diffTitles).toEqual(expect.arrayContaining([
      props.titles.before,
      props.titles.after,
    ]));
  });

  test('should provide a default title (if not passed manually); and should be able to expand and close fullScreen View', async () => {
    const props = {
      diff: [
        {
          resourceId: 'import123',
          action: 'new',
          after: {
            _connectionId: 'conn.new',
            name: 'New Import',
          },
        },
      ],
      resourceType: 'import',
      integrationId: 'int123',
    };

    initResourceDiffContainer(props);
    expect(screen.queryByText('References')).not.toBeInTheDocument();
    const fullScreen = document.querySelector('[data-test="expandAll"]');

    expect(fullScreen).toBeEnabled();
    await userEvent.click(fullScreen);
    const fullScreenDialog = screen.getByRole('dialog');

    expect(fullScreenDialog).toBeInTheDocument();
    const containerTitles = Array.from(fullScreenDialog.querySelectorAll('p')).map(ele => ele.textContent.trim());
    const diffTitles = Array.from(fullScreenDialog.querySelectorAll('td')).map(ele => ele.textContent.trim());

    expect(containerTitles).toEqual([
      props.diff[0].after.name,
      'Action: New',
    ]);
    expect(diffTitles).toEqual(expect.arrayContaining([
      'Before changes',
      'After changes',
    ]));
    const closeFullScreen = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeFullScreen);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should show conflicts and conflict status in title bar', () => {
    const props = {
      diff: [
        {
          resourceId: 'int123',
          action: 'conflict',
          conflicts: [
            [
              {
                path: [
                  '/',
                  'aliases',
                ],
                ops: [
                  {
                    path: [
                      5,
                    ],
                    op: 'add',
                    value: {
                      _importId: '62720db2aa212b62052bb3a2',
                      alias: 'importid2',
                    },
                  },
                ],
              },
              {
                path: [
                  '/',
                  'aliases',
                ],
                op: 'remove',
              },
            ],
          ],
          after: {
            aliases: [
              {
                _flowId: 'flow123',
                alias: 'parentflow1',
              },
            ],
          },
          before: {
            aliases: [
              {
                _flowId: 'flow123',
                alias: 'export_id',
              },
            ],
          },
        },
      ],
      resourceType: 'integration',
      integrationId: 'int123',
    };

    initResourceDiffContainer(props);
    expect(screen.getByRole('button', {name: 'Integrations'})).toBeInTheDocument();
    expect(screen.getByText('Conflicts')).toBeInTheDocument();
    expect(screen.getByText('1 conflict')).toBeInTheDocument();
    expect(screen.getByText('Action: Conflict')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });

  test('should show References; and resourceId if name not set', async () => {
    const props = {
      titles: {
        before: 'Before pull',
        after: 'After pull',
      },
      diff: [
        {
          resourceId: 'exp123',
          action: 'removed',
          before: {
            _connectionId: 'conn123',
            name: 'The Export',
          },
        },
      ],
      resourceType: 'export',
      integrationId: 'int123',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resource.references = {
        flows: [
          {
            id: 'flow123',
            name: 'Parent Flow',
            dependencyIds: {
              export: [
                'exp123',
              ],
            },
          },
        ],
        integrations: [
          {
            id: 'int123',
            name: 'Clone - Aliases Test',
            dependencyIds: {
              flow: [
                'flow123',
              ],
            },
          },
        ],
      };

      draft.data.resources.flows = [
        {
          _id: 'flow123',
          _integrationId: 'int123',
        },
      ];
    });

    initResourceDiffContainer(props, initialStore);

    expect(screen.getByRole('button', {name: 'Exports'})).toBeInTheDocument();

    const containerTitles = Array.from(document.querySelectorAll('p')).map(ele => ele.textContent.trim());

    expect(containerTitles).toEqual([
      props.diff[0].resourceId,
      'Action: Removed',
    ]);

    const openReferences = screen.getByText('References');

    expect(openReferences).toBeInTheDocument();
    await userEvent.click(openReferences);

    const referencesModal = screen.getByRole('dialog');

    expect(referencesModal).toBeInTheDocument();
    expect(referencesModal).toHaveTextContent('References');
    const tabNames = screen.getAllByRole('tab').map(ele => ele.textContent);

    expect(tabNames).toEqual([
      'Used by flows in this integration',
      'Used by flows in other integrations',
    ]);
    const usedByInThisIntegrationTab = document.querySelector('[data-test="usedByInThisIntegration"]');
    const usedByInOtherIntegrationsTab = document.querySelector('[data-test="usedByInOtherIntegrations"]');

    expect(usedByInThisIntegrationTab).toHaveAttribute('aria-selected', 'true');
    expect(usedByInOtherIntegrationsTab).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByRole('columnheader')).toHaveTextContent('Name');
    expect(screen.getByRole('link')).toHaveTextContent('Parent Flow');

    await userEvent.click(usedByInOtherIntegrationsTab);
    const colHeaders = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(colHeaders).toEqual([
      'Integration name',
      'Flow name',
    ]);
    const closeDialog = screen.getByTestId('closeModalDialog');

    await userEvent.click(closeDialog);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('should only show a spinner if resourceReferences not present', async () => {
    const props = {
      titles: {
        before: 'Before pull',
        after: 'After pull',
      },
      diff: [
        {
          resourceId: 'exp123',
          action: 'removed',
          before: {
            _connectionId: 'conn123',
            name: 'The Export',
          },
        },
      ],
      resourceType: 'export',
      integrationId: 'int123',
    };

    initResourceDiffContainer(props);
    const openReferences = screen.getByText('References');

    expect(openReferences).toBeInTheDocument();
    await userEvent.click(openReferences);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  test('should not render table if resourceReferences is an empty Array', async () => {
    const props = {
      titles: {
        before: 'Before pull',
        after: 'After pull',
      },
      diff: [
        {
          resourceId: 'exp123',
          action: 'removed',
          before: {
            _connectionId: 'conn123',
            name: 'The Export',
          },
        },
      ],
      resourceType: 'export',
      integrationId: 'int123',
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resource.references = {
        integrations: [],
      };
    });

    initResourceDiffContainer(props, initialStore);
    const openReferences = screen.getByText('References');

    expect(openReferences).toBeInTheDocument();
    await userEvent.click(openReferences);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog').textContent).toContain('This resource isn’t being used anywhere.');
  });
});
