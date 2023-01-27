
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import DynaTable from './index';
import { renderWithProviders } from '../../../../test/test-utils';

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => props.children,
}));

jest.mock('./DynaConnectorNColumnMap', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaConnectorNColumnMap'),
  default: () => <div>DynaConnectorNColumnMap</div>,
}));

jest.mock('./DynaStaticMap', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaStaticMap'),
  default: () => <div>DynaStaticMap</div>,
}));

jest.mock('./DynaRefreshableStaticMap', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaRefreshableStaticMap'),
  default: () => <div>DynaRefreshableStaticMap</div>,
}));

jest.mock('./DynaStaticMapWidget', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaStaticMapWidget'),
  default: () => <div>DynaStaticMapWidget</div>,
}));

jest.mock('./DynaTable', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaTable'),
  default: () => <div>DynaTable</div>,
}));
describe('dynaTable UI tests', () => {
  const mockonFieldChange = jest.fn();
  const props = {
    connectionId: '5b3c75dd5d3c125c88b5dd20',
    optionsMap: [{value: 'value'}],
    map: [],
    _integrationId: '6b3c75dd5d3c125c88b5dd20',
    extractFieldHeader: true,
    extracts: [],
    onFieldChange: mockonFieldChange,
    value: [],
    keyResource: 'flows',
    valueResource: 'flows',
  };

  test('should pass the initial render when extractFieldHeader and extracts are present', () => {
    renderWithProviders(<DynaTable {...props} />);
    expect(screen.getByText('DynaStaticMapWidget')).toBeInTheDocument();
  });
  test('should render DynaStaticMap when keyResource,valueResource,connectionId are not passed', () => {
    const newProps = {...props, extractFieldHeader: null, extracts: null, keyResource: undefined, valueResource: undefined, connectionId: undefined};

    renderWithProviders(<DynaTable {...newProps} />);
    expect(screen.getByText('DynaStaticMap')).toBeInTheDocument();
  });
  test('should render DynaConnectoroNColumnMap when appropriate conditions are met', () => {
    const newProps = {...props, extractFieldHeader: null, extracts: null, keyResource: undefined, valueResource: undefined};

    renderWithProviders(<DynaTable {...newProps} />);
    expect(screen.getByText('DynaConnectorNColumnMap')).toBeInTheDocument();
  });
  test('should render DynaRefreshableStaticMap when appropriate conditions are met', () => {
    const newProps = {...props, optionsMap: [], extractFieldHeader: null, extracts: null};

    renderWithProviders(<DynaTable {...newProps} />);
    expect(screen.getByText('DynaRefreshableStaticMap')).toBeInTheDocument();
  });
  test('should render the generic table view when none of the conditions are met', () => {
    const newProps = {...props, map: undefined, optionsMap: [], extractFieldHeader: null, extracts: null, keyResource: undefined, valueResource: undefined, connectionId: undefined};

    renderWithProviders(<DynaTable {...newProps} />);
    expect(screen.getByText('DynaTable')).toBeInTheDocument();
  });
});
