import React from 'react';
import { screen } from '@testing-library/react';
import FilterPanelWrapper from '.';
import { getCreatedStore } from '../../../../../store';
import { renderWithProviders } from '../../../../../test/test-utils';

const initialStore = getCreatedStore();

function initFilterPanelWrapper(props = {}) {
  initialStore.getState().session.editors = {filecsv: {
    sampleDataStatus: props.status,
  }};

  return renderWithProviders(<FilterPanelWrapper {...props} />, {initialStore});
}
jest.mock('../../../../Spinner', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Spinner'),
  default: () => (
    <div>Loading Spinner</div>
  ),
}));
jest.mock('./FilterPanel', () => ({
  __esModule: true,
  ...jest.requireActual('./FilterPanel'),
  default: () => (
    <div>FilterPanel</div>
  ),
}));
describe('filterPanelWrapper UI tests', () => {
  test('should render the loading spinner when editor status is "requested"', () => {
    initFilterPanelWrapper({status: 'requested', editorId: 'filecsv'});
    expect(screen.getByText('Loading Spinner')).toBeInTheDocument();
  });
  test('should render the FilterPanel component when editor status is other than "requested"', () => {
    initFilterPanelWrapper({editorId: 'filecsv'});
    expect(screen.getByText('FilterPanel')).toBeInTheDocument();
  });
});
