import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import ConsoleGridItem from '.';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

jest.mock('../../panels/Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../panels/Code'),
  default: props => (
    <div>{props.value}</div>
  ),
}));

function initConsoleGridItem(props = {}) {
  initialStore.getState().session.editors = {'file.csv': {
    result: { logs: ['result1']},
  }};

  return renderWithProviders(<ConsoleGridItem {...props} />, {initialStore});
}

describe('consoleGridItem UI tests', () => {
  test('should pass the initial render', () => {
    initConsoleGridItem({editorId: 'file.csv'});
    expect(screen.getByText('result1')).toBeInTheDocument();
  });
  test('should render empty DOM when result propperty is not present for a particular editorId state', () => {
    const {utils} = initConsoleGridItem({editorId: 'files.csv'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
