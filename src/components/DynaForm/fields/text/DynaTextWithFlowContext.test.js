/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import DynaTextWithFlowContext from './DynaTextWithFlowContext';

async function initDynaTextWithFlowContext(props, _keepDeltaBehindFlowId) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    flows: [
      {_id: '_flowId', _keepDeltaBehindFlowId},
    ],
  };

  return renderWithProviders(<DynaTextWithFlowContext {...props} />, { initialStore });
}
describe('DynaTextWithFlowContext tests', () => {
  test('Should able to test DynaTextWithFlowContext with _keepDeltaBehindFlowId set', async () => {
    await initDynaTextWithFlowContext({flowId: '_flowId'}, true);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
  test('Should able to test DynaTextWithFlowContext with with _keepDeltaBehindFlowId unset', async () => {
    await initDynaTextWithFlowContext({flowId: '_flowId'}, false);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
});

