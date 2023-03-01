
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaNetsuiteExportType from './DynaNetsuiteExportType';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.metadata = {application: {someconnectionId: {somePath: {
    data: [{name: 'someName', scriptId: 'once', doesNotSupportCreate: true}],
  }}}};
});

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initDynaNetsuiteExportType(props = {}) {
  const ui = (
    <DynaNetsuiteExportType
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}
const mockOnFieldChange = jest.fn();
const genralProps = {
  value: 'once',
  selectOptions: [],
  defaultValue: 'someDefaultValue',
  id: 'someID',
  onFieldChange: mockOnFieldChange,
  connectionId: 'someconnectionId',
  options: {commMetaPath: 'somePath', recordType: 'once'},
  filterKey: 'suitescript-recordTypes',
};

describe('dynaNetsuiteExportType Ui test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call the onfield function with default value', () => {
    initDynaNetsuiteExportType(genralProps);
    expect(mockOnFieldChange).toHaveBeenCalledWith('someID', 'someDefaultValue');
  });
  test('should not call onfield change when value is not provided as once', () => {
    initDynaNetsuiteExportType({...genralProps, value: 'anyvalue'});
    expect(mockOnFieldChange).not.toHaveBeenCalledWith();
  });
  test('should show the other options', async () => {
    initDynaNetsuiteExportType({...genralProps, value: 'randomscript', selectOptions: [{name: 'name', value: 'someLabel'}]});
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('someLabel')).toBeInTheDocument();
  });
  test('should show once as option when once is not supported', async () => {
    const props = {selectOptions: [{name: 'name', value: 'someLabel'}, {name: 'name2', value: 'once'}], options: {commMetaPath: 'somePath', recordType: 'once'}};

    initDynaNetsuiteExportType({...genralProps, ...props});
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('someLabel')).toBeInTheDocument();
    expect(screen.queryByText('once')).not.toBeInTheDocument();
  });
  test('should show all option when no record types is provided', async () => {
    const props = {...genralProps, selectOptions: [{name: 'name', value: 'someLabel'}, {name: 'name2', value: 'once'}], options: {commMetaPath: 'somePath', recordType: 'once'}};

    renderWithProviders(
      <DynaNetsuiteExportType
        {...props}
    />
    );
    await userEvent.click(screen.getByRole('button'));
    const menuItems = screen.getAllByRole('menuitem');

    expect(menuItems).toHaveLength(3);
    expect(menuItems[1].textContent).toBe('once');
    expect(menuItems[2].textContent).toBe('someLabel');

    expect(mockOnFieldChange).not.toHaveBeenCalled();
  });
});
