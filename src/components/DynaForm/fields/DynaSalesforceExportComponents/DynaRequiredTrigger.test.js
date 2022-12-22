/* global describe, test, jest, expect */
import { render, screen } from '@testing-library/react';
import React from 'react';
import DynaRequiredTrigger from './DynaRequiredTrigger';

jest.mock('../DynaText', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaText'),
  default: props => (
    <div>
      <div>Testing Dyna Text</div>
      <div>options = {JSON.stringify(props.options)}</div>
    </div>
  ),
}));

describe('Testsuite for Dyna Required Trigger', () => {
  test('should render the Dyna Required trigger and test the mocked the Dyna text', () => {
    render(
      <DynaRequiredTrigger {...{options: 'testing options'}} />
    );
    expect(screen.getByText(/Testing Dyna Text/i)).toBeInTheDocument();
  });
});
