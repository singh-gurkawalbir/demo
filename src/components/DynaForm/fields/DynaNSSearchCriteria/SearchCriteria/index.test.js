
import React from 'react';
import {
  screen, waitFor, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../../actions';
import SearchCriteriaEditor from './index';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

const initialStore = getCreatedStore();

function initSearchCriteriaEditor(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: [
          {
            label: 'Audience Description',
            value: 'audience',
            type: 'select',
          },
          {
            label: 'Base Cost',
            value: 'basecost',
            type: 'currency',
          },
          {
            label: 'Campaign Event',
            value: 'event',
            type: 'text',
          },
        ],
        errorMessage: 'Test Error Message',
      },
    },
    }};
    draft.data.resources = {
      connections: [{
        _id: '5efd8663a56953365bd28541',
        offline: props.offline,
      }],
    };
    draft.session.searchCriteriaReducer = {
      filecsv1: {
        searchCriteria: [{
          field: 'audience',
          key: '0c9Nx2kTQ',
          operator: 'noneof',
          searchValue: '1,2,3',
          searchValue2Enabled: false,
          showFormulaField: false,
          width: '80vw',
          height: '50vh',
        }] },
    };
  });

  return renderWithProviders(<SearchCriteriaEditor {...props} />, {initialStore});
}

jest.mock('../../../../icons/RefreshIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../icons/RefreshIcon'),
  default: () => <div>RefreshIcon</div>,
}));

// jest.mock('../../DynaTypeableSelect', () => ({
//   __esModule: true,
//   ...jest.requireActual('../../DynaTypeableSelect'),
//   default: props => <input onClick={() => props.renderer} />,
// }));

describe('searchCriteriaEditor UI tests', () => {
  const mockOnRefresh = jest.fn();
  //   const [mockdisableSave, setMockDisableSave] = useState(true);

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
  const props = {
    editorId: 'filecsv',
    disabled: false,
    onRefresh: mockOnRefresh,
    connectionId: '5efd8663a56953365bd28541',
    commMetaPath: 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
    filterKey: 'salesforce-sObject-layout',
  };

  test('should pass the initial render', () => {
    initSearchCriteriaEditor(props);
    expect(screen.getByText('Operator')).toBeInTheDocument();
    expect(screen.getByText('Search Value')).toBeInTheDocument();
    expect(screen.getByText('Search Value 2')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');

    expect(fields).toHaveLength(3);
  });
  test('should make a dispatch call on initial render', async () => {
    initSearchCriteriaEditor(props);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.searchCriteria.init('filecsv', props.value)));
  });
  test('should open the fields when clicked on the "Field" text field', async () => {
    initSearchCriteriaEditor({...props, editorId: 'filecsv1'});
    const fields = screen.getAllByRole('textbox');

    fireEvent.focusIn(fields[0]);
    await waitFor(() => expect(screen.getByText('Audience Description')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Base Cost')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Campaign Event')).toBeInTheDocument());
  });
  test('should make a dispatch call when a new option is clicked from the dropdown', async () => {
    initSearchCriteriaEditor({...props, editorId: 'filecsv1'});
    const fields = screen.getAllByRole('textbox');

    fireEvent.focusIn(fields[0]);
    expect(screen.getByText('Audience Description')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Audience Description'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
  });
  test('should make a dispatch call whenever a row is deleted', async () => {
    initSearchCriteriaEditor({...props, editorId: 'filecsv1'});
    const deleteButtons = screen.getAllByRole('button');

    await userEvent.click(deleteButtons[1]);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.searchCriteria.delete('filecsv1', 0)));
  });
  test('should make a dipatch call on initial render', async () => {
    initSearchCriteriaEditor({...props, editorId: 'filecsv1', value: []});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.searchCriteria.init('filecsv1', [])));
  });
  test('hould diplay the operator options when clicked on operator dropdown', async () => {
    initSearchCriteriaEditor({...props, editorId: 'filecsv1'});
    await userEvent.click(screen.getByText('Please select'));
    waitFor(() => {
      expect(screen.getByText('any')).toBeInTheDocument();
      expect(screen.getByText('contains')).toBeInTheDocument();
      expect(screen.getByText('does not contain')).toBeInTheDocument();
      expect(screen.getByText('does not start with')).toBeInTheDocument();
      expect(screen.getByText('equal to')).toBeInTheDocument();
      expect(screen.getByText('has key words')).toBeInTheDocument();
      expect(screen.getByText('is')).toBeInTheDocument();
      expect(screen.getByText('is empty')).toBeInTheDocument();
    });
  });
});
