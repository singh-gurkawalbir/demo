
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaChildIntegrations from './DynaChildIntegrations';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initDynaChildIntegrations(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        fields: {
          integration: {
            value: '5b3c75dd5d3c125c88b5dd20',
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
    };
  });

  return renderWithProviders(<DynaChildIntegrations {...props} />, {initialStore});
}

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => props.children,
}));

describe('dynaChildIntegrations UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    formKey: 'formKey',
    id: 'testId',
    onFieldChange: mockonFieldChange,
    value: [],
    label: 'resource',
    child: {
      function: jest.fn(),
    },
    disabled: false,
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    initDynaChildIntegrations(props);
    expect(screen.getByText('Choose resource')).toBeInTheDocument();
  });
  test('should display integrations in the dropdown when clicked on please select option', async () => {
    initDynaChildIntegrations(props);
    expect(screen.getByText('Choose resource')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Choose resource'));
    expect(screen.getByText('integration2')).toBeInTheDocument();
    expect(screen.getByText('integration3')).toBeInTheDocument();
    expect(screen.getByText('integration4')).toBeInTheDocument();
  });
  test('should render empty DOM when integration is not a parent child integration', async () => {
    const {utils} = initDynaChildIntegrations({...props, formKey: 'newformKey', child: {}});

    await waitFor(() => expect(utils.container).toBeEmptyDOMElement());
  });
});
