import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import SelectPreviewRecordsSize from '.';
import { getCreatedStore } from '../../../store';
import { runServer } from '../../../test/api/server';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';

let initialStore;
const mocksetIsValidRecordSize = jest.fn();

async function initSelectPreviewRecordsSize({resourceId = '123', isValidRecordSize = true, setIsValidRecordSize = mocksetIsValidRecordSize} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.resourceFormSampleData[resourceId] = {
      preview: {
        data: {
          parse: [
            {
              id: 123,
              name: 'Testing',
            },
          ],
        },
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <SelectPreviewRecordsSize isValidRecordSize={isValidRecordSize} resourceId={resourceId} setIsValidRecordSize={setIsValidRecordSize} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../DynaForm/fields/DynaSelectWithInput', () => ({
  __esModule: true,
  ...jest.requireActual('../../DynaForm/fields/DynaSelectWithInput'),
  default: props => (
    <div>
      <input onChange={e => props.onFieldChange(props.id, e.target.value)} data-test={props.id} type="text" value={props.value} />
      <span>{props.errorMessages}</span>
    </div>

  ),
}));

describe('testsuite for SelectPreviewRecordsSize', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('should enter the value above 1000 in text input and verify the error message shown', async () => {
    await initSelectPreviewRecordsSize();
    const recordSizeTextInputNode = document.querySelector('input[data-test="record-size"]');

    await userEvent.clear(recordSizeTextInputNode);
    await userEvent.type(recordSizeTextInputNode, '1000');
    expect(screen.getByText(/Value can't exceed 100./i)).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'RESOURCE_FORM_SAMPLE_DATA_UPDATE_RECORD_SIZE',
      resourceId: '123',
      recordSize: 100,
    });
  });
  test('should enter the value below 100 and verify the value', async () => {
    await initSelectPreviewRecordsSize();
    const recordSizeTextInputNode = document.querySelector('input[data-test="record-size"]');

    await userEvent.clear(recordSizeTextInputNode);
    await userEvent.type(recordSizeTextInputNode, '95');
    expect(recordSizeTextInputNode).toHaveValue('95');
  });
  test('should enter the value is zero and verify the value', async () => {
    await initSelectPreviewRecordsSize();
    const recordSizeTextInputNode = document.querySelector('input[data-test="record-size"]');

    await userEvent.clear(recordSizeTextInputNode);
    expect(mocksetIsValidRecordSize).toHaveBeenCalledTimes(9);
  });
  test('should enter the value which is of type text instead of number', async () => {
    await initSelectPreviewRecordsSize();
    const recordSizeTextInputNode = document.querySelector('input[data-test="record-size"]');

    await userEvent.clear(recordSizeTextInputNode);
    await userEvent.type(recordSizeTextInputNode, 'abc');
    expect(screen.getByText(/Invalid size./i)).toBeInTheDocument();
  });
});

