import React from 'react';
import {screen} from '@testing-library/react';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

import InputOutputTitle from './InputOutputTitle';

const initialStore = getCreatedStore();

function initInputOutputTitle(props = {}) {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        version: props.version,
        isGroupedSampleData: props.sample,
        isGroupedOutput: props.output,
      },
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<InputOutputTitle {...props} />, {initialStore});
}

jest.mock('../../../../Help', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../Help'),
  default: () => (
    <div>Help text</div>

  ),
}));

describe('inputOutputTitle UI tests', () => {
  test('should pass the initial render for version 2 and inputGroupedSample data', () => {
    initInputOutputTitle({helpKey: 'test', title: 'Input', version: 2, sample: true});
    expect(screen.getByText('Source rows [ ]')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
  test('should display "Source record" heading for version 2 when input sample data is not grouped', () => {
    initInputOutputTitle({helpKey: 'test', title: 'Input', version: 2, sample: false});
    expect(screen.getByText('Source record { }')).toBeInTheDocument();
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
  test('should pass the initial render for version 2 and output sample data is grouped', () => {
    initInputOutputTitle({helpKey: 'test', title: 'Output', version: 2, output: true});
    expect(screen.getByText('Destination rows [ ]')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
  test('should pass the initial render for version 2 and output sample data is not grouped', () => {
    initInputOutputTitle({helpKey: 'test', title: 'Output', version: 2, output: false});
    expect(screen.getByText('Destination record { }')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
  test('should not diplay the message when mapping version is not 2.0', () => {
    initInputOutputTitle({helpKey: 'test', title: 'Output', output: false});
    expect(screen.queryByText('Destination record { }')).toBeNull();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Help text')).toBeInTheDocument();
  });
});
