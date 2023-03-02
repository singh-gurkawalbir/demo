/* eslint-disable jest/no-conditional-expect */

import React from 'react';
import {
  fireEvent,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaFlowsTiedToIntegration from './index';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';

const initialStore = getCreatedStore();

jest.mock('../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../LoadResources'),
  default: props => props.children,
}));

function initDynaFlowsTiedToIntegration(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        fields: {
          integration: {
            value: '5b3c75dd5d3c125c88b5dd20',
            touched: true,
          },
          childIntegrations: {
            value: ['5c3c75dd5d3c125c88b5dd20', '5b3c75dd5d3c125b88b5dd20', '5b3c75dd5d3c125b88b5dd21'],
          },
        },
      },
    };
    draft.data.resources = {
      integrations: [
        {
          _id: '5b3c75dd5d3c125c88b5dd20',
          name: 'integration1',
          installSteps: [{id: 'no lie'}],
          initChild: props.child,
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
      flows: [
        {
          _id: '6b3c75dd5d3c125c88b5dd20',
          name: 'flow1',
          installSteps: [{id: 'no lie'}],
          initChild: props.child,
          _connectionId: '5b3c75dd5d3c125c88b5dd21',
        },
        {
          _id: '6c3c75dd5d3c125c88b5dd20',
          _integrationId: '5b3c75dd5d3c125c88b5dd20',
          name: 'flow2',
          _connectionId: '5b2c75dd5d3c125c88b5dd21',
        },
        {
          _id: '6b3c75dd5d3c125b88b5dd20',
          name: 'flow3',
          _integrationId: '5b3c75dd5d3c125c88b5dd20',
          _connectionId: '5b3c75dd5d3c225c88b5dd21',
        },
        {
          _id: '6b3c75dd5d3c125b88b5dd21',
          name: 'flow4',
          _integrationId: '5b3c75dd5d3c125c88b5dd20',
          _connectionId: '5b3c75dd5d3c225c88b5dd21',
        },
      ],
    };
  });

  return renderWithProviders(<DynaFlowsTiedToIntegration {...props} />, {initialStore});
}

describe('dynaFlowsTiedToIntegration UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    formKey: 'formKey',
    id: 'testId',
    onFieldChange: mockonFieldChange,
    value: [],
    label: 'Resource',
    child: {
      function: jest.fn(),
    },
    disabled: false,
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    initDynaFlowsTiedToIntegration(props);
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });
  test('should diplay the attached flows when clicked on the dropdown', async () => {
    initDynaFlowsTiedToIntegration(props);
    const dropdown = screen.getByText('Select...');

    expect(dropdown).toBeInTheDocument();
    await userEvent.click(dropdown);
    expect(screen.getByText('flow2')).toBeInTheDocument();
    expect(screen.getByText('flow3')).toBeInTheDocument();
    expect(screen.getByText('flow4')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
  test('should render disabled dropdown when integrationId is not passed', async () => {
    initDynaFlowsTiedToIntegration({...props, formKey: 'newFormKey'});
    const dropdownField = screen.getByText('Select...');

    expect(dropdownField).toBeInTheDocument();
    try {
      await fireEvent.click(dropdownField);
    } catch (e) {
      expect(e.message).toBe('Unable to perform pointer interaction as the element inherits `pointer-events: none`:');
    }
  });
});
