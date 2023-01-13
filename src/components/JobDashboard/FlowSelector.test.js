
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowSelector from './FlowSelector';
import { renderWithProviders } from '../../test/test-utils';
import { getCreatedStore } from '../../store';

let initialStore;

function initFlowSelector({integrationId, childId, value, onChange}) {
  initialStore.getState().data.resources.integrations = [{
    _id: '12345',
    name: 'Test integration name',
  },
  {
    _id: '67839',
    name: 'Test Integration App Name',
    _connectorId: '328e9',
  },
  ];
  initialStore.getState().data.resources.flows = [{
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
  initialStore.getState().data.resources.connections = [{
    _id: 'abcde',
    name: 'Test connection 1',
    _integrationId: '12345',
  }, {
    _id: 'fghijk',
    name: 'Test connection 2',
    _integrationId: '12345',
  }];
  initialStore.getState().data.resources.exports = [{
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
  initialStore.getState().data.resources.imports = [{
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

  test('should test the flow selector by selecting a flow from integration', () => {
    initFlowSelector({
      integrationId: '12345',
      onChange: mockOnChange,
    });
    const selectFlowButtonNode = screen.getByRole('button', {
      name: /select flow/i,
    });

    expect(selectFlowButtonNode).toBeInTheDocument();
    userEvent.click(selectFlowButtonNode);
    const selectFlowButton = screen.getByRole('option', {name: /select flow/i});

    expect(selectFlowButton).toBeInTheDocument();
    const testFlowName1Button = screen.getByRole('option', {name: /test flow name 1/i});

    expect(testFlowName1Button).toBeInTheDocument();
    userEvent.click(testFlowName1Button);
    expect(mockOnChange).toHaveBeenCalledWith('67890');
  });
  test('should test the flow selector by selecting a integration app flow', () => {
    initFlowSelector({
      integrationId: '67839',
      onChange: mockOnChange,
    });
    const selectFlowButtonNode = screen.getByRole('button', {
      name: /select flow/i,
    });

    expect(selectFlowButtonNode).toBeInTheDocument();
    userEvent.click(selectFlowButtonNode);
    const testFlowName2Button = screen.getByRole('option', {name: /test flow name 2/i});

    expect(testFlowName2Button).toBeInTheDocument();
    userEvent.click(testFlowName2Button);
    expect(mockOnChange).toHaveBeenCalledWith('4d282');
  });
});
