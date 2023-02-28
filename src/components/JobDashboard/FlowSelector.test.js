
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowSelector from './FlowSelector';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';

let initialStore;

function initFlowSelector({integrationId, childId, value, onChange}) {
  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '12345',
      name: 'Test integration name',
    },
    {
      _id: '67839',
      name: 'Test Integration App Name',
      _connectorId: '328e9',
    },
    ];
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
    },
    {
      _id: '4d282',
      name: 'Test flow name 2',
      _integrationId: '67839',
      _connectorId: '328e9',
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
    },
    ];
    draft.data.resources.connections = [{
      _id: 'abcde',
      name: 'Test connection 1',
      _integrationId: '12345',
    }, {
      _id: 'fghijk',
      name: 'Test connection 2',
      _integrationId: '12345',
    }];
    draft.data.resources.exports = [{
      _id: 'xsjxks',
      name: 'Test export',
      _connectionId: 'abcde',
      _integrationId: '12345',
    }, {
      _id: 'xsjxkw',
      name: 'Test export 1',
      _connectionId: 'abcde',
      _integrationId: '67839',
      _connectorId: '328e9',
    }];
    draft.data.resources.imports = [{
      _id: 'nxksnn',
      name: 'Test import',
      _connectionId: 'fghijk',
      _integrationId: '12345',
    },
    {
      _id: 'y7xsjx',
      name: 'Test import 1',
      _connectionId: 'fghijk',
      _integrationId: '67839',
      _connectorId: '328e9',
    }];
  });

  const ui = (
    <FlowSelector integrationId={integrationId} childId={childId} value={value} onChange={onChange} />
  );

  return renderWithProviders(ui, {initialStore});
}

const mockOnChange = jest.fn();

describe('testsuite for FlowSelector', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  test('should test the flow selector by selecting a flow from integration', async () => {
    initFlowSelector({
      integrationId: '12345',
      onChange: mockOnChange,
    });
    const selectFlowButtonNode = screen.getByRole('button', {
      name: /select flow/i,
    });

    expect(selectFlowButtonNode).toBeInTheDocument();
    await userEvent.click(selectFlowButtonNode);
    const selectFlowButton = screen.getByRole('option', {name: /select flow/i});

    expect(selectFlowButton).toBeInTheDocument();
    const testFlowName1Button = screen.getByRole('option', {name: /test flow name 1/i});

    expect(testFlowName1Button).toBeInTheDocument();
    await userEvent.click(testFlowName1Button);
    expect(mockOnChange).toHaveBeenCalledWith('67890');
  });
  test('should test the flow selector by selecting a integration app flow', async () => {
    initFlowSelector({
      integrationId: '67839',
      onChange: mockOnChange,
    });
    const selectFlowButtonNode = screen.getByRole('button', {
      name: /select flow/i,
    });

    expect(selectFlowButtonNode).toBeInTheDocument();
    await userEvent.click(selectFlowButtonNode);
    const testFlowName2Button = screen.getByRole('option', {name: /test flow name 2/i});

    expect(testFlowName2Button).toBeInTheDocument();
    await userEvent.click(testFlowName2Button);
    expect(mockOnChange).toHaveBeenCalledWith('4d282');
  });
});
