
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import FlowSchedule from '.';

const newprops = {flow: {_integrationId: '626bda66987bb423914b486f'}, resources: 'flows', required: true};

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props => (
    props.children
  ),
}));

jest.mock('./Buttons', () => ({
  __esModule: true,
  ...jest.requireActual('./Buttons'),
  default: () => (
    <div>FlowSchedule Buttons</div>
  ),
}));

jest.mock('./Form', () => ({
  __esModule: true,
  ...jest.requireActual('./Form'),
  default: () => (
    <div>Flowschedule Form</div>
  ),
}));

describe('Flow schedule test', () => {
  test('should render the Flow schedule component', () => {
    renderWithProviders(<FlowSchedule {...newprops} />);
    expect(screen.getByText(/FlowSchedule Buttons/i)).toBeInTheDocument();
    expect(screen.getByText(/Flowschedule Form/i)).toBeInTheDocument();
  });
});

