
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import SelectedLabelImp from './index';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.data.resources = {
    flows: [
      {
        _id: '634b79db0cbd27707a2d5080',
        name: 'flownametest',
        _integrationId: 456,
        _flowGroupingId: 6748392,
      },
    ],
    integrations: [{
      _id: 456,
      flowGroupings: [{
        _id: 6748392,
        name: 'flownametest2'}],
      name: 'p154',
    }],
    flowGroupings: [{
      _id: 6748392,
      name: 'flownametest2',
    }],
  };
});

describe('uI test cases for selectedmultiselectfilterlabel', () => {
  test('should display name when there are no flowgroupings', () => {
    renderWithProviders(<SelectedLabelImp name="flowGroupingTest" id="453245676527707a465432d" />);
    const res = screen.getByText('flowGroupingTest');

    expect(res).toBeInTheDocument();
  });
  test('should display name when the name is All flows', () => {
    renderWithProviders(<SelectedLabelImp name="All flows" id="453245676527707a465432d" />);
    const allFlowstext = screen.getByText('All flows');

    expect(allFlowstext).toBeInTheDocument();
  });
  test('should display flowgroup name when flow groupings are provided', () => {
    renderWithProviders(<SelectedLabelImp name="flownametest" id="634b79db0cbd27707a2d5080" />, {initialStore});
    const flowname = screen.getByText('| flownametest2');

    expect(flowname).toBeInTheDocument();
  });
});
