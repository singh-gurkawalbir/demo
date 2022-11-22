/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import ErrorGridItem from '.';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

jest.mock('../../panels/Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../panels/Code'),
  default: props => (
    <div>{props.value}</div>
  ),
}));

function initErrorGridItem(props = {}) {
  initialStore.getState().session.editors = {
    javascript1: {
      editorType: 'javascript',
      rule: {
        scriptId: '611cc6a882edfc2c354d6f92',
        fetchScriptContent: false,
        code: 'var testPremap = function (opt\n}',
        _init_code: "var testPremap = function (options) {\n  throw new Error('options::' + JSON.stringify(options))\n  return options.data.map((d) => {\n    return {\n      data: d\n    }\n  })\n}",
      },
      data: '{\n}',
      fieldId: '',
      autoEvaluate: false,
      layout: 'compact',
      originalRule: {
        fetchScriptContent: true,
      },
      sampleDataStatus: props.status,
      lastValidData: '{\n}',
      previewStatus: 'error',
      error: [
        'Message: SyntaxError: Unexpected identifier',
        'Location: Line 6',
        'Stack: SyntaxError: Unexpected identifier',
      ],
      errorLine: 5,
    },
  };

  return renderWithProviders(<ErrorGridItem {...props} />, {initialStore});
}

describe('ErrorGridItem UI tests', () => {
  test('should pass the initial render', () => {
    initErrorGridItem({editorId: 'javascript1', status: 'received'});
    expect(screen.getByText('Message: SyntaxError: Unexpected identifier', {exact: false})).toBeInTheDocument();
    expect(screen.getByText('Location: Line 6', {exact: false})).toBeInTheDocument();
    expect(screen.getByText('Stack: SyntaxError: Unexpected identifier', {exact: false})).toBeInTheDocument();
  });
  test('should render empty DOM when editor "sampleDataStatus" is requested', () => {
    const {utils} = initErrorGridItem({editorId: 'files.csv', status: 'requested'});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render empty DOM when editorId is invalid and when editor rule is valid ', () => {
    const {utils} = initErrorGridItem({editorId: 'file.csv', status: 'requested'});

    expect(utils.container).toBeEmptyDOMElement();
  });
});
