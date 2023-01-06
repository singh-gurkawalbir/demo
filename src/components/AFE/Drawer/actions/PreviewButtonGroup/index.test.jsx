
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import PreviewButtonGroup from '.';
import actions from '../../../../../actions';
import {
  reduxStore,
  renderWithProviders,
} from '../../../../../test/test-utils';

const initialStore = reduxStore;
const mockDispatch = jest.fn();

function initPreviewButtonGroup(props = {}) {
  const ui = (<PreviewButtonGroup {...props} />
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
describe('PreviewButtonGroup UI tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test preview button', () => {
    initialStore.getState().session.editors = {
      'mappings-632950280dbc53086e899759': {
        editorType: 'mappings',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '632950280dbc53086e899759',
        resourceType: 'imports',
        stage: 'importMappingExtract',
        data: 'somedata',
        editorTitle: 'Edit mapping: Test ZD Import',
        fieldId: '',
        layout: 'compact2',
        autoEvaluate: false,
        sampleDataStatus: 'received',
        lastValidData: 'somelastvaliddata',
        saveStatus: 'received',
      },
    };
    initPreviewButtonGroup({
      editorId: 'mappings-632950280dbc53086e899759',
    });
    const previewButton = document.querySelector(
      '[data-test="previewEditorResult"]'
    );

    expect(previewButton).toBeEnabled();
    userEvent.click(previewButton);
    const spanEle = document.querySelector(
      'span[class="MuiTouchRipple-ripple MuiTouchRipple-rippleVisible"]'
    );

    expect(spanEle).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.previewRequest('mappings-632950280dbc53086e899759')
    );
  });
  test('should test autopreview checkbox', () => {
    initialStore.getState().session.editors = {
      'mappings-632950280dbc53086e899759': {
        editorType: 'mappings',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '632950280dbc53086e899759',
        resourceType: 'imports',
        stage: 'importMappingExtract',
        data: 'somedata',
        editorTitle: 'Edit mapping: Test ZD Import',
        fieldId: '',
        layout: 'compact2',
        autoEvaluate: true,
        sampleDataStatus: 'received',
        lastValidData: 'somelastvaliddata',
        saveStatus: 'disabled',
      },
    };
    initPreviewButtonGroup({
      editorId: 'mappings-632950280dbc53086e899759',
    });
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeChecked();
    userEvent.click(checkBox);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.editor.toggleAutoPreview('mappings-632950280dbc53086e899759')
    );
  });
  test('should test preview when save status is set to requested', () => {
    initialStore.getState().session.editors = {
      'mappings-632950280dbc53086e899759': {
        editorType: 'mappings',
        flowId: '63a54e63d9e20c15d94da0f1',
        resourceId: '632950280dbc53086e899759',
        resourceType: 'imports',
        stage: 'importMappingExtract',
        data: 'somedata',
        editorTitle: 'Edit mapping: Test ZD Import',
        fieldId: '',
        layout: 'compact2',
        autoEvaluate: false,
        sampleDataStatus: 'received',
        lastValidData: 'somelastvaliddata',
        saveStatus: 'requested',
      },
    };
    initPreviewButtonGroup({
      editorId: 'mappings-632950280dbc53086e899759',
    });
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).not.toBeChecked();
  });
});
