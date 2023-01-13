import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import WarningGridItem from '.';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

jest.mock('../../panels/Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../panels/Code'),
  default: props => (
    <div>{props.value}</div>
  ),
}));

function initWarningGridItem(props = {}) {
  initialStore.getState().session.editors = {'file.csv': {
    sampleDataStatus: props.status,
    result: { warning: props.warning},
  }};

  return renderWithProviders(<WarningGridItem {...props} />, {initialStore});
}

describe('warningGridItem UI tests', () => {
  test('should pass the initial render', () => {
    initWarningGridItem({editorId: 'file.csv', status: 'recieved', warning: 'Invalid data format'});
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Invalid data format')).toBeInTheDocument();
  });
  test('should render empty DOM when editor result status is "requested"', () => {
    const {utils} = initWarningGridItem({editorId: 'files.csv', status: 'requested'});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render empty DOM when editor result does not contain a warning propperty', () => {
    const {utils} = initWarningGridItem({editorId: 'files.csv', status: 'recieved'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
