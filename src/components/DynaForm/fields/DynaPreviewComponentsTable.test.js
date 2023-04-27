
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaPreviewComponentsTable from './DynaPreviewComponentsTable';

describe('test for previewing resources while cloning', () => {
  test('should expand only flows section by default', async () => {
    const props = {
      useColumns: () => [],
      resourceType: 'integrations',
      data: [
        {
          model: 'Integration',
          _id: 'integration123',
          name: 'Automation Flows',
        },
        {
          model: 'Flow',
          _id: 'flow123',
          name: 'Netsuite Flow',
        },
        {
          model: 'Connection',
          _id: 'connection123',
          name: 'Netsuite connection',
        },
        {
          model: 'AsyncHelper',
          _id: 'async123',
          name: 'AsyncHelper',
        },
        {
          model: 'FileDefinition',
          _id: 'fd123',
          name: 'FileDefinition',
        },
      ],
    };

    renderWithProviders(<DynaPreviewComponentsTable {...props} />);
    const components = screen.getAllByRole('button').map(ele => ele.textContent);

    expect(components).toEqual([
      'Flows',
      'Integrations',
      'Connections',
      'Async helpers',
      'File definitions',
    ]);
    const flowsTable = document.querySelector('[data-test="Flows"]');
    const integrationTable = document.querySelector('[data-test="Integrations"]');
    const connectionTable = document.querySelector('[data-test="Connections"]');
    const asyncHelperTable = document.querySelector('[data-test="Async helpers"]');
    const fileDefinitionsTable = document.querySelector('[data-test="File definitions"]');

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(flowsTable).toHaveAttribute('aria-expanded', 'true');
    [integrationTable, connectionTable, asyncHelperTable, fileDefinitionsTable].forEach(table =>
      expect(table).toHaveAttribute('aria-expanded', 'false')
    );
    await userEvent.click(screen.getByRole('button', {name: 'Connections'}));
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  test('should not show flows section while cloning import', () => {
    const props = {
      useColumns: () => [],
      resourceType: 'imports',
      data: [{
        model: 'Connection',
        _id: 'connection123',
        name: 'Netsuite connection',
      }],
    };

    renderWithProviders(<DynaPreviewComponentsTable {...props} />);
    expect(screen.queryByRole('button', {name: 'Flows'})).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Connections');
  });

  test('should not show flows section while cloning export', () => {
    const props = {
      useColumns: () => [],
      resourceType: 'exports',
      data: [{
        model: 'Connection',
        _id: 'connection123',
        name: 'Netsuite connection',
      }],
    };

    renderWithProviders(<DynaPreviewComponentsTable {...props} />);
    expect(screen.queryByRole('button', {name: 'Flows'})).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Connections');
  });
});
