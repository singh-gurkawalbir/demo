
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import { Chip } from '@mui/material';
import userEvent from '@testing-library/user-event';
import {GenericTypeableSelect} from './GenericTypeableSelect';
import { getCreatedStore } from '../../../../../store';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';

const initialStore = getCreatedStore();

jest.mock('../../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../LoadResources'),
  default: props => props.children,
}));

const SelectedValueChips = ({value, label}) => (
  <Chip
    value={value}
    label={label}
  />
);

function initGenericTypeableSelect(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        fields: {
          integration: {
            value: '5b3c75dd5d3c125c88b5dd20',
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

  return renderWithProviders(<GenericTypeableSelect {...props} />, {initialStore});
}

describe('genericTypeableSelect UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    formKey: 'formKey',
    id: 'testId',
    onFieldChange: mockonFieldChange,
    value: [],
    label: 'Resource',
    SelectedValueImpl: SelectedValueChips,
    SelectedOptionImpl: SelectedValueChips,
    options: [{
      value: '5c3c75dd5d3c125c88b5dd20',
      _parentId: '5b3c75dd5d3c125c88b5dd20',
      label: 'integration2',
      _connectionId: '5b2c75dd5d3c125c88b5dd21',
    },
    {
      value: '5b3c75dd5d3c125b88b5dd20',
      label: 'integration3',
      _parentId: '5b3c75dd5d3c125c88b5dd20',
      _connectionId: '5b3c75dd5d3c225c88b5dd21',
    },
    {
      value: '5b3c75dd5d3c125b88b5dd21',
      label: 'integration4',
      _parentId: '5b3c75dd5d3c125c88b5dd20',
      _connectionId: '5b3c75dd5d3c225c88b5dd21',
    }],
    disabled: false,
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    initGenericTypeableSelect(props);
    expect(screen.getByText('Select...')).toBeInTheDocument();
    waitFor(() => {
      const dropdown = screen.getByRole('textbox');

      expect(dropdown).toBeInTheDocument();
    });
  });
  test('should open the dropdown with options when dropdown field is clicked', async () => {
    initGenericTypeableSelect(props);
    waitFor(async () => {
      const dropdown = screen.getByRole('textbox');

      expect(dropdown).toBeInTheDocument();
      await userEvent.click(dropdown);
    });
    waitFor(() => {
      expect(screen.getByText('integration2')).toBeInTheDocument();
      expect(screen.getByText('integration3')).toBeInTheDocument();
      expect(screen.getByText('integration4')).toBeInTheDocument();
    });
  });
  test('should call the onchange function passed in props when selected option is changed', async () => {
    initGenericTypeableSelect(props);
    waitFor(async () => {
      const dropdown = screen.getByRole('textbox');

      expect(dropdown).toBeInTheDocument();
      await userEvent.click(dropdown);
    });
    waitFor(() => { expect(screen.getByText('integration2')).toBeInTheDocument(); });
    waitFor(async () => {
      await userEvent.click(screen.getByText('integration2'));
      expect(mockonFieldChange).toHaveBeenCalled();
    });
  });
});
