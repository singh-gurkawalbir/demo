
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../actions';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import DynaRelatedList from './index';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

function initDynaRelatedList(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {
      application: {
        '5efd8663a56953365bd28541': {
          'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
            data: {
              childRelationships: [
                { label: 'label1', name: 'name 1', relationshipName: 'test relation', field: 'test parent field', childSObject: 'Quote' },
                { label: 'label2', name: 'name 2', relationshipName: 'test relation', field: 'test parent field', childSObject: 'Quote' },
                { label: 'label3', name: 'name 3', relationshipName: 'test relation', field: 'test parent field', childSObject: 'Quote' },
              ],
            },
            status: props.status,
          },
        },
      },
    };
  });

  return renderWithProviders(<DynaRelatedList {...props} />, { initialStore });
}

jest.mock('../../../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../CodeEditor'),
  default: () => <div>CodeEditor<input /></div>,
}));

describe('dynaRelatedList UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
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

  const mockonFieldChange = jest.fn();
  const mockhandleClose = jest.fn();
  const props = {
    value: [{ parentField: 'test parent field', sObjectType: 'Quote' }],
    options: 'Quote',
    connectionId: '5efd8663a56953365bd28541',
    onFieldChange: mockonFieldChange,
    handleClose: mockhandleClose,
    status: 'received',
  };

  test('should pass the initial render', () => {
    initDynaRelatedList();
    expect(screen.getByText('CodeEditor')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();     // edit button  //
  });
  test('should open the modal on clicking the edit button', async () => {
    initDynaRelatedList();
    const editButton = screen.getByRole('button');

    expect(screen.queryByText('Related lists')).toBeNull();

    await userEvent.click(editButton);
    expect(screen.getByText('Related lists')).toBeInTheDocument();
  });
  test('should display the add list option along with the table in the modal', async () => {
    initDynaRelatedList(props);
    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    expect(screen.getByText('Related lists')).toBeInTheDocument();
    expect(screen.getByText('Add new related list')).toBeInTheDocument();
  });
  test('should display the table headers along with data correctly in the modal', async () => {
    initDynaRelatedList(props);
    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    expect(screen.getByText('Relationship')).toBeInTheDocument();
    expect(screen.getByText('Child sObject')).toBeInTheDocument();
    expect(screen.getByText('Referenced Fields')).toBeInTheDocument();
    expect(screen.getByText('Order By')).toBeInTheDocument();

    expect(screen.getByText('test relation')).toBeInTheDocument();
    expect(screen.getByText('Quote')).toBeInTheDocument();
  });
  test('should display the edit and delete actions when clicked on the ellipsis menu in the table', async () => {
    initDynaRelatedList(props);

    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const ellipsisButton = document.querySelector('[data-test="openActionsMenu"]');

    expect(ellipsisButton).toBeInTheDocument();
    await userEvent.click(ellipsisButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  test('should close the current open Modal and open another modal when clicked on the edit button from the menu', async () => {
    initDynaRelatedList(props);

    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const ellipsisButton = document.querySelector('[data-test="openActionsMenu"]');

    expect(ellipsisButton).toBeInTheDocument();
    await userEvent.click(ellipsisButton);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    await userEvent.click((screen.getByText('Edit')));
    expect(screen.queryByText('Add new related list')).toBeNull();
    expect(screen.getByText('Back to related list')).toBeInTheDocument();
  });
  test('should delete the data row when clicked on the delete button from the table ellipsis menu', async () => {
    initDynaRelatedList(props);

    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const ellipsisButton = document.querySelector('[data-test="openActionsMenu"]');

    expect(ellipsisButton).toBeInTheDocument();
    await userEvent.click(ellipsisButton);
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();

    expect(screen.getByText('test relation')).toBeInTheDocument();

    await userEvent.click((screen.getByRole('menuitem', { name: 'Delete' })));
    expect(screen.queryByText('test relation')).toBeNull();
  });
  test('should call the onFieldChange function when clicked on save button', async () => {
    initDynaRelatedList(props);
    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
    await userEvent.click(saveButton);
    expect(mockonFieldChange).toHaveBeenCalled();
  });

  test('should close the current modal and open another modal when clicked on Add related list option', async () => {
    initDynaRelatedList(props);
    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const addListButton = screen.getByRole('button', { name: 'Add new related list' });

    expect(addListButton).toBeInTheDocument();
    await userEvent.click(addListButton);
    expect(screen.queryByText('Add new related list')).toBeNull();
    expect(screen.getByText('Back to related list')).toBeInTheDocument();
  });
  test('should display the form with all the field labels within the second modal when it is opened', async () => {
    initDynaRelatedList(props);
    const editButton = screen.getByRole('button');

    await userEvent.click(editButton);
    const addListButton = screen.getByRole('button', { name: 'Add new related list' });

    expect(addListButton).toBeInTheDocument();
    await userEvent.click(addListButton);
    expect(screen.getByText('Referenced fields')).toBeInTheDocument();
    expect(screen.getByText('Filter expression')).toBeInTheDocument();
    expect(screen.getByText('Order by')).toBeInTheDocument();
    expect(screen.getByText('Order')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Back to related list')).toBeInTheDocument();
    expect(screen.getByText('Add selected')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  test('should make a dispatch call on initial render when metadata call status is undefined', async () => {
    initDynaRelatedList({ ...props, status: undefined });
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.request('5efd8663a56953365bd28541', 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote', { refreshCache: true })));
  });
});
