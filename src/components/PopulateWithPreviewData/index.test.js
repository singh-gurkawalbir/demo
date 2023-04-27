import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { mutateStore, renderWithProviders} from '../../test/test-utils';
import PopulateWithPreviewData from '.';
import { getCreatedStore } from '../../store';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import messageStore from '../../utils/messageStore';
import { getAsyncKey } from '../../utils/saveAndCloseButtons';
import { wrapExportFileSampleData } from '../../utils/sampleData';

const initialStore = getCreatedStore();

const formKey = 'newForm';

const updateMockDataContent = jest.fn();

function initPopulateWithPreviewData(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [
        {
          id: 'import1',
          assistant: 'googledrive',
          type: 'http',
        },
      ],
      exports: [
        {
          _id: 'export1',
          adaptorType: 'HTTPExport',
        },
        {
          _id: 'ftpnoparse',
          type: 'blob',
          adaptorType: 'FTPExport',
        },
      ],
    };
    draft.session.form = {
      [formKey]: {
        fields: {
          mockOutput: {
            resourceId: '6385c3d96e36a72ff64a4b90',
            resourceType: 'exports',
            flowId: '6385c3dd6e36a72ff64a4b93',
            label: 'Mock output',
            helpKey: 'mockOutput',
            type: 'mockoutput',
            fieldId: 'mockOutput',
            id: 'mockOutput',
            name: '/mockOutput',
            defaultValue: '',
            value: '',
            touched: false,
            visible: true,
            required: false,
            disabled: false,
            options: {},
            isValid: true,
            isDiscretelyInvalid: false,
            errorMessages: '',
          },
          mockResponse: {
            resourceId: '6385c3d96e36a72ff64a4b90',
            resourceType: 'imports',
            flowId: '6385c3dd6e36a72ff64a4b93',
            label: 'Mock response',
            helpKey: 'mockResponse',
            type: 'mockresponse',
            fieldId: 'mockResponse',
            id: 'mockResponse',
            name: '/mockResponse',
            defaultValue: '',
            value: '',
            touched: false,
            visible: true,
            required: false,
            disabled: false,
            options: {},
            isValid: true,
            isDiscretelyInvalid: false,
            errorMessages: '',
          },
        },
      },
    };
  });

  return renderWithProviders(
    <PopulateWithPreviewData
      formKey={formKey}
      {...props}
    />, {initialStore}
  );
}

describe('PopulateWithPreviewData UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    mutateStore(initialStore, draft => {
      draft.session = {};
    });
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUEST:
        case actionTypes.FORM.FIELD.ON_FIELD_CHANGE: () => {}; break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should return null for invalid arguments', () => {
    const {utils} = initPopulateWithPreviewData({});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should not render populate with preview data button if export does not have a preview panel', () => {
    const {utils} = initPopulateWithPreviewData({
      resourceId: 'ftpnoparse',
      resourceType: 'exports',
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should render populate with preview data button if export has a preview panel', () => {
    initPopulateWithPreviewData({
      resourceId: 'export1',
      resourceType: 'exports',
    });

    expect(screen.getByText(/Populate with preview data/i)).toBeInTheDocument();
  });
  test('should always render populate with preview data button for imports', () => {
    initPopulateWithPreviewData({
      resourceId: 'import1',
      resourceType: 'imports',
    });

    expect(screen.getByText(/Populate with sample response data/i)).toBeInTheDocument();
  });
  test('should disable populate with preview data button if resource sample data is requested for exports', () => {
    mutateStore(initialStore, draft => {
      draft.session = {
        resourceFormSampleData: {
          export1: {
            preview: {
              status: 'requested',
            },
          },
        },
      };
    });
    initPopulateWithPreviewData({
      resourceId: 'export1',
      resourceType: 'exports',
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

    expect(buttonRef).toBeDisabled();
  });
  test('should disable populate with preview data button if resource sample data is requested for exports dupliccate', () => {
    mutateStore(initialStore, draft => {
      draft.session = {
        resourceFormSampleData: {
          export1: {
            preview: {
              status: 'requested',
            },
          },
        },
      };
    });
    initPopulateWithPreviewData({
      resourceId: 'export1',
      resourceType: 'exports',
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

    expect(buttonRef).toBeDisabled();
  });
  test('should disable populate with preview data button after click for exports', async () => {
    initPopulateWithPreviewData({
      resourceId: 'export1',
      resourceType: 'exports',
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

    expect(buttonRef).toBeInTheDocument();
    expect(buttonRef).toBeEnabled();
    await userEvent.click(buttonRef);
    expect(buttonRef).toBeDisabled();
  });
  test('should not disable populate with preview data button after click for imports', async () => {
    initPopulateWithPreviewData({
      resourceId: 'import1',
      resourceType: 'imports',
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with sample response data'});

    expect(buttonRef).toBeInTheDocument();
    expect(buttonRef).toBeEnabled();
    await userEvent.click(buttonRef);
    expect(buttonRef).toBeEnabled();
  });
  test('should dispatch correct action and render correct snackbar on click for imports', async () => {
    initPopulateWithPreviewData({
      resourceId: 'import1',
      resourceType: 'imports',
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with sample response data'});

    expect(buttonRef).toBeInTheDocument();
    expect(buttonRef).toBeEnabled();
    await userEvent.click(buttonRef);
    const previewData = [
      {
        id: '1234567890',
        errors: [{
          code: 'error_code',
          message: 'error message',
          source: 'application',
        }],
        ignored: false,
        statusCode: 200,
        dataURI: '',
        _json: { responseField1: '', responseField2: '' },
      },
    ];

    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.form.fieldChange(formKey)('mockResponse', previewData)
    ));

    expect(screen.getByText(messageStore('POPULATE_WITH_PREVIEW_DATA.SUCCESS', {fieldName: 'Mock response', dataType: 'sample data'}))).toBeInTheDocument();
  });
  test('should dispatch correct action and render correct snackbar on success on click for exports', async () => {
    const resourceType = 'exports';
    const resourceId = 'export1';

    initPopulateWithPreviewData({
      resourceId,
      resourceType,
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

    expect(buttonRef).toBeInTheDocument();
    expect(buttonRef).toBeEnabled();
    await userEvent.click(buttonRef);
    expect(buttonRef).toBeDisabled();
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.resourceFormSampleData.request(formKey, { refreshCache: true, asyncKey: getAsyncKey(resourceType, resourceId) })
    ));

    const previewData = [
      {
        id: '1234567890',
        errors: [{
          code: 'error_code',
          message: 'error message',
          source: 'application',
        }],
        ignored: false,
        statusCode: 200,
        dataURI: '',
        _json: { responseField1: '', responseField2: '' },
      },
    ];

    initialStore.dispatch(
      actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
    );
    await waitFor(() => expect(updateMockDataContent).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.form.fieldChange(formKey)('mockOutput', wrapExportFileSampleData(previewData))
    ));
    await waitFor(() => expect(screen.getByText(messageStore('POPULATE_WITH_PREVIEW_DATA.SUCCESS', {fieldName: 'Mock output', dataType: 'preview data'}))).toBeInTheDocument());
  });
  test('should call updateMockDataContent function and render correct snackbar on success on click for exports', async () => {
    const resourceType = 'exports';
    const resourceId = 'export1';

    initPopulateWithPreviewData({
      resourceId,
      resourceType,
      updateMockDataContent,
    });
    waitFor(async () => {
      const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

      expect(buttonRef).toBeInTheDocument();
      expect(buttonRef).toBeEnabled();
      await userEvent.click(buttonRef);
      expect(buttonRef).toBeDisabled();
    });
    waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.resourceFormSampleData.request(formKey, { refreshCache: true, asyncKey: getAsyncKey(resourceType, resourceId) })
    ));

    const previewData = [
      {
        id: '1234567890',
        errors: [{
          code: 'error_code',
          message: 'error message',
          source: 'application',
        }],
        ignored: false,
        statusCode: 200,
        dataURI: '',
        _json: { responseField1: '', responseField2: '' },
      },
    ];

    act(() => {
      initialStore.dispatch(
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );
    });
    waitFor(() => expect(updateMockDataContent).toHaveBeenCalledTimes(1));
    waitFor(() => expect(mockDispatchFn).not.toBeCalledWith(
      actions.form.fieldChange(formKey)('mockOutput', wrapExportFileSampleData(previewData))
    ));
    waitFor(() => expect(screen.getByText(messageStore('POPULATE_WITH_PREVIEW_DATA.SUCCESS', {fieldName: 'Mock output', dataType: 'preview data'}))).toBeInTheDocument());
  });
  test('should dispatch correct action and render correct snackbar on error on click for exports', async () => {
    const resourceType = 'exports';
    const resourceId = 'export1';

    initPopulateWithPreviewData({
      resourceId,
      resourceType,
    });
    const buttonRef = screen.getByRole('button', {name: 'Populate with preview data'});

    expect(buttonRef).toBeInTheDocument();
    expect(buttonRef).toBeEnabled();
    await userEvent.click(buttonRef);
    expect(buttonRef).toBeDisabled();
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(
      actions.resourceFormSampleData.request(formKey, { refreshCache: true, asyncKey: getAsyncKey(resourceType, resourceId) })
    ));

    initialStore.dispatch(
      actions.resourceFormSampleData.receivedPreviewError(resourceId, 'someError')
    );
    await waitFor(() => expect(buttonRef).toBeEnabled());
    await waitFor(() => expect(screen.getByText(messageStore('POPULATE_WITH_PREVIEW_DATA.FAILED', {fieldName: 'mock output'}))).toBeInTheDocument());
  });
});
