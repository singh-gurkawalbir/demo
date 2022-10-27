/* global describe, test, expect, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders} from '../../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../../store';

import OutputPanel from '.';

jest.mock('../../Code', () => ({
  __esModule: true,
  ...jest.requireActual('../../Code'),
  default: props => (
    <div>{props.value}</div>
  ),
}));
const initialStore = getCreatedStore();

function initOutputPanel(props = {}) {
  initialStore.getState().session.editors = {filecsv: {
    fieldId: 'file.csv',
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    previewStatus: props.status,
    resourceType: 'imports',
    formOutput: props.data,
  }};

  return renderWithProviders(<OutputPanel {...props} />, {initialStore});
}
describe('Output Panel UI tests', () => {
  test('should pass the initial render', () => {
    initOutputPanel({editorId: 'filecsv', status: 'success', data: 'custom value'});
    expect(screen.getByText('custom value')).toBeInTheDocument();
  });
  test('should display a prompt to click the preview when no data is present in the output', () => {
    initOutputPanel({editorId: 'filecsv', status: 'success'});
    expect(screen.getByText('Click the ‘test form’ button above to preview form output.')).toBeInTheDocument();
  });
  test('should display the loading message on screen when previewStatus is requested', () => {
    initOutputPanel({editorId: 'filecsv', status: 'requested'});
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

