
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaAllIntegrations from './DynaAllIntegrations';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => props.children,
}));

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

const initialStore = getCreatedStore();

const integrations = [
  {
    _id: '5b3c75dd5d3c125c88b5dd20',
    name: 'integration1',
    _connectionId: '5b3c75dd5d3c125c88b5dd21',
  },
  {
    _id: '5c3c75dd5d3c125c88b5dd20',
    name: 'integration2',
    _connectionId: '5b2c75dd5d3c125c88b5dd21',
  },
  {
    _id: '5b3c75dd5d3c125b88b5dd20',
    name: 'integration3',
    _connectionId: '5b3c75dd5d3c225c88b5dd21',
  },
  {
    _id: '5b3c75dd5d3c125b88b5dd20',
    name: 'integration4',
    _connectionId: '5b3c65dd5d3c125c88b5dd21',
  },
  {
    _id: '5b3c75dd5d3c125c88b5cd20',
    name: 'integration5',
    _connectionId: '5b3c75dd5d3c125c88b5dd22',
  },
];

describe('dynaAllIntegrations UI tests', () => {
  test('should pass the initial render', () => {
    renderWithProviders(<DynaAllIntegrations />);
    expect(screen.getByText('Please select')).toBeInTheDocument();
  });
  test('should display integrations in the dropdown when clicked on please select option', async () => {
    mutateStore(initialStore, draft => {
      draft.data.resources = {
        integrations,
      };
    });
    renderWithProviders(<DynaAllIntegrations />, {initialStore});
    expect(screen.getByText('Please select')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Please select'));
    expect(screen.getByText('integration1')).toBeInTheDocument();
    expect(screen.getByText('integration2')).toBeInTheDocument();
    expect(screen.getByText('integration3')).toBeInTheDocument();
    expect(screen.getByText('integration4')).toBeInTheDocument();
    expect(screen.getByText('integration5')).toBeInTheDocument();
  });
});
