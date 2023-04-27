
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import CeligoTable from '../../../CeligoTable';
import metadata from './metadata';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.suiteScript = {ssLinkedConnectionId: {integrations: [
    {
      _id: 'integrationId',
      _connectorId: '_connectorId',
      urlName: 'someurlName',
    },
  ],
  },
  };
});

function renderFunction(flow, actionProps) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        actionProps={actionProps}
        {...metadata}
        data={
      [flow]
    }
    />
    </MemoryRouter>, {initialStore});
}

describe('suite script flows metadata ui test', () => {
  test('should test the name field', () => {
    renderFunction(
      {_id: 'FlowId', _integrationId: 'integrationId'}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Unnamed (id: FlowId)')).toBeInTheDocument();
  });
  test('should test the type field', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT'}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });
  test('should test the Mapping field', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Mapping')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit mappings')).toBeInTheDocument();
  });
  test('should test the Schedule field', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByLabelText('Change schedule')).toBeInTheDocument();
  });
  test('should test the Run field', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Run')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    const runbutton = buttons.find(each => each.getAttribute('data-test') === 'runFlow');

    expect(runbutton).toBeDefined();
  });
  test('should test the Off/On field', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});

    expect(screen.getByText('Off/On')).toBeInTheDocument();

    const checkbox = screen.getAllByRole('checkbox');

    const offonBox = checkbox.find(each => each.getAttribute('data-test') === 'toggleOnAndOffFlowUnnamed (id: FlowId)');

    expect(offonBox).toBeDefined();
  });
  test('should test the Delete field with delete heading', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId'});
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });
  test('should test the Delete field without delete heading', () => {
    renderFunction({_id: 'FlowId', _integrationId: 'integrationId', type: 'EXPORT', editable: true}, {ssLinkedConnectionId: 'ssLinkedConnectionId', isConnector: true});
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete')).not.toBeInTheDocument();
  });
});
