/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import DynaFlowGroupsTiedToIntegrations from './DynaFlowGroupsTiedToIntegrations';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initDynaFlowGroupsTiedToIntegrations(props = {}) {
  initialStore.getState().session.form = {
    formKey: {
      value: {
        integration: '5b3c75dd5d3c125c88b5dd20',
      },
    },
  };
  initialStore.getState().data.resources = {
    integrations: [
      {
        _id: '5b3c75dd5d3c125c88b5dd20',
        name: 'integration1',
        installSteps: [{id: 'no lie'}],
        initChild: props.child,
        flowGroupings: props.group,
        _connectionId: '5b3c75dd5d3c125c88b5dd21',
      },
      {
        _id: '5c3c75dd5d3c125c88b5dd20',
        _parentId: '5b3c75dd5d3c125c88b5dd20',
        name: 'integration2',
        _connectionId: '5b2c75dd5d3c125c88b5dd21',
      },
      {
        _id: '5b3c75dd5d3c125b88b5dd20',
        name: 'integration3',
        _parentId: '5b3c75dd5d3c125c88b5dd20',
        _connectionId: '5b3c75dd5d3c225c88b5dd21',
      },
      {
        _id: '5b3c75dd5d3c125b88b5dd21',
        name: 'integration4',
        _parentId: '5b3c75dd5d3c125c88b5dd20',
        _connectionId: '5b3c75dd5d3c225c88b5dd21',
      },
    ],
  };

  return renderWithProviders(<DynaFlowGroupsTiedToIntegrations {...props} />, {initialStore});
}

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => props.children,
}));

describe('DynaFlowGroupsTiedToIntegrations UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    formKey: 'formKey',
    id: 'testId',
    onFieldChange: mockonFieldChange,
    value: [],
    label: 'flow groupings',
    child: {
      function: jest.fn(),
    },
    disabled: false,
    group: [{_id: 'id1', name: 'group1'}, {_id: 'id2', name: 'group2'}, {_id: 'id3', name: 'group3'}],
  };

  test('should pass the initial render', () => {
    initDynaFlowGroupsTiedToIntegrations(props);
    expect(screen.getByText('flow groupings')).toBeInTheDocument();
    const dropdown = document.querySelector('[id=testId]');

    expect(dropdown).toBeInTheDocument();
  });
  test('should render empty DOM when flowgroupings are not present in the integration', () => {
    const {utils} = initDynaFlowGroupsTiedToIntegrations({...props, group: undefined});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
