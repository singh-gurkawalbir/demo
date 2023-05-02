import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';
import actions from '../../../../../../actions';
import Mapper2Row from './Mapper2Row';
import { ConfirmDialogProvider } from '../../../../../ConfirmDialog';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: 'intialURL'},
  }),
}));

jest.mock('../../../../../icons/StaticLookupIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/StaticLookupIcon'),
  default: () => <div>StaticLookupIcon</div>,
}));

jest.mock('../../../../../icons/DynamicLookupIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/DynamicLookupIcon'),
  default: () => <div>DynamicLookupIcon</div>,
}));

jest.mock('../../../../../icons/HardCodedIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/HardCodedIcon'),
  default: () => <div>HardCodedIcon</div>,
}));

jest.mock('../../../../../icons/HandlebarsExpressionIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/HandlebarsExpressionIcon'),
  default: () => <div>HandlebarsExpressionIcon</div>,
}));

jest.mock('../../../../../icons/TrashIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/TrashIcon'),
  default: () => <div>TrashIcon</div>,
}));

jest.mock('../../../../../icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/AddIcon'),
  default: () => <div>AddIcon</div>,
}));

jest.mock('../../../../../icons/SettingsIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../icons/SettingsIcon'),
  default: () => <div>SettingsIcon</div>,
}));

jest.mock('./TabbedRow', () => ({
  __esModule: true,
  ...jest.requireActual('./TabbedRow'),
  default: () => <div>Mock Tabbed Row</div>,
}));

jest.mock('./Destination/Mapper2Generates', () => ({
  __esModule: true,
  ...jest.requireActual('./Destination/Mapper2Generates'),
  default: props => <input disabled={props.disabled} onChange={e => props.onBlur(e.target.value)} data-testid="fieldMappingGenerate" type="text" />,
}));

jest.mock('./Destination/Mapper2GeneratesWithDropdown', () => ({
  __esModule: true,
  ...jest.requireActual('./Destination/Mapper2GeneratesWithDropdown'),
  default: props => <input disabled={props.disabled} onChange={e => props.onBlur(e.target.value)} data-testid="fieldMapper2GeneratesWithDropdown" type="text" />,
}));

jest.mock('./Source/Mapper2ExtractsTypeableSelect', () => ({
  __esModule: true,
  ...jest.requireActual('./Source/Mapper2ExtractsTypeableSelect'),
  default: props => <input disabled={props.disabled} onChange={e => props.onBlur(e.target.value, 'somejsonpath')} data-testid="mapper2ExtractsTypeableSelect" type="text" />,
}));

const initialStore = reduxStore;

function initMapper2Row(props = {}, initialStore) {
  const ui = (
    <ConfirmDialogProvider>
      <Mapper2Row
        {...props}
      />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Mapper2Row UI test cases', () => {
  test('should not show mapping row when hidden props is provided', () => {
    const {utils} = initMapper2Row({hidden: true});

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should show tabs rows when isTabNode prop is provided', () => {
    initMapper2Row({isTabNode: true});

    expect(screen.getByText('Mock Tabbed Row')).toBeInTheDocument();
  });
  test('should make dispatch call when generate field is changed', async () => {
    initMapper2Row();

    const generateInput = screen.getByTestId('fieldMappingGenerate');

    await userEvent.type(generateInput, 'sometext');
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchField('generate', undefined, 'sometext')
    );
  });
  test('reshould make dispatch call when generate field is changed', () => {
    mutateStore(initialStore, draft => {
      draft.session.mapping.mapping = {importSampleData: {
        id: 'ae36eaba-cff3-4454-9f1f-9c1a8e69b37a',
        rowNumber: 1,
        note: '',
        AccountRef: {
          value: 'mrcool5@gmail.com',
        },
        ShipToAddress: {
          id: '6077167f-eee0-4ae0-96f8-217df2975424',
          rowNumber: 1,
          note: null,
          custom: {},
          files: [],
        } }};
    });
    initMapper2Row({}, initialStore);

    const generateInput = screen.getByTestId('fieldMapper2GeneratesWithDropdown');

    userEvent.type(generateInput, 'sometext');
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchField('generate', undefined, 'sometext')
    );
  });
  test('should make dispatch call when extract field is changed', async () => {
    initMapper2Row({});

    const typableExtractInput = screen.getByTestId('mapper2ExtractsTypeableSelect');

    await userEvent.type(typableExtractInput, 'sometext');
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchField('extract', undefined, 'sometext', undefined, 'somejsonpath')
    );
  });
  test('should make dispatch call to add new row when add button is clicked', async () => {
    const nodeKey = 'somenodeey';

    initMapper2Row({nodeKey});

    const addButton = screen.getByText('AddIcon');

    await userEvent.click(addButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.addRow(nodeKey)
    );
  });
  test('should click on trash icon and delete row for rows having no child', async () => {
    const nodeKey = 'somenodekey';

    initMapper2Row({nodeKey});

    const deleteButton = screen.getByText('TrashIcon');

    await userEvent.click(deleteButton);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.deleteRow(nodeKey)
    );
  });
  test('should show dialog box on clicking trashicon and make dispatch call for deleting node', async () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    const deleteButton = screen.getByText('TrashIcon');

    await userEvent.click(deleteButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Delete'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.deleteRow(nodeKey)
    );
  });
  test('should redirect to setting page when setting icon is clicked', async () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row generate={[]} nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    const settingsIcon = screen.getByText('SettingsIcon');

    await userEvent.click(settingsIcon);
    expect(mockHistoryPush).toHaveBeenCalledWith('intialURL/settings/v2/somenodekey/');
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateActiveKey(nodeKey)
    );
  });
  test('should show static Look UP icon when mapping is dynamic look up', () => {
    const nodeKey = 'somenodekey';

    mutateStore(initialStore, draft => {
      draft.session.mapping = {mapping: {importId: 'someimportID', lookups: [{name: 'someLookUpName', map: []}]}};
    });

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row lookupName="someLookUpName" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>, {initialStore});

    expect(screen.getByText('StaticLookupIcon')).toBeInTheDocument();
  });
  test('should show Dynamic Look UP icon when mapping is dynamic look up', () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row lookupName="someLookUpName" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    expect(screen.getByText('DynamicLookupIcon')).toBeInTheDocument();
  });
  test('should icon of hardcode when mapping is hardcoded', () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row hardCodedValue="somevalue" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    expect(screen.getByText('HardCodedIcon')).toBeInTheDocument();
  });
  test('should icon of isHandlebarExp when mapping is hardcoded', () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row extract="/" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    expect(screen.getByText('HandlebarsExpressionIcon')).toBeInTheDocument();
  });
  test('should show the title of required messahe when mapping is mandatory', () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row isRequired extract="/" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    expect(screen.getByLabelText('This field is required by the application you are importing into')).toBeInTheDocument();
  });
  test('should not show extract field when dataypye is of object and copysource is no', () => {
    const nodeKey = 'somenodekey';

    renderWithProviders(<ConfirmDialogProvider ><MemoryRouter><Mapper2Row dataType="object" nodeKey={nodeKey} >somechildren </Mapper2Row></MemoryRouter></ConfirmDialogProvider>);

    expect(screen.queryByTestId('mapper2ExtractsTypeableSelect')).not.toBeInTheDocument();
  });
});
