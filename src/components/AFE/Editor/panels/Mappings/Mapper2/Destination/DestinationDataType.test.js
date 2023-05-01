import React from 'react';
import {screen, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DestinationDataType from './DestinationDataType';
import { renderWithProviders} from '../../../../../../../test/test-utils';
import {ConfirmDialogProvider} from '../../../../../../ConfirmDialog';
import actions from '../../../../../../../actions';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../../icons/ArrowDownFilledIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../icons/ArrowDownFilledIcon'),
  default: () => (
    <div>ArrowDownFilledIcon</div>
  ),
}));

const mockHandleBlur = jest.fn();
let anchor = null;
const mockSetAnchorel = jest.fn(anchorEl => { anchor = anchorEl; });

function initFunction(dataType = 'string', anchorEl = null, renderFun = render) {
  const ui = (
    <ConfirmDialogProvider >
      <DestinationDataType
        dataType={dataType} setAnchorEl={mockSetAnchorel} anchorEl={anchorEl}
        nodeKey="somenodekey" handleBlur={mockHandleBlur}
    />
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {renderFun});
}

describe('mapper2 DestinationDataType test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call setAnchorEl function with event target', () => {
    initFunction();
    userEvent.click(screen.getByText('string'));
    expect(mockSetAnchorel).toHaveBeenCalledTimes(1);
  });
  test('should call setAnchorEl function with null', () => {
    const {utils} = initFunction();

    userEvent.click(screen.getByText('string'));
    expect(mockSetAnchorel).toHaveBeenCalledTimes(1);
    initFunction('string', anchor, utils.rerender);

    const allbutton = screen.getAllByRole('button');
    const list = allbutton.map(each => each.textContent);

    expect(list).toEqual(
      [
        'stringArrowDownFilledIcon',
        'string',
        'number',
        'boolean',
        'object',
        '[string]',
        '[number]',
        '[boolean]',
        '[object]',
      ]
    );
    userEvent.click(screen.getByText('ArrowDownFilledIcon'));
    expect(mockSetAnchorel).toHaveBeenCalledWith(null);
  });
  test('should change the data type', () => {
    const {utils} = initFunction();

    userEvent.click(screen.getByText('string'));
    expect(mockSetAnchorel).toHaveBeenCalledTimes(1);
    initFunction('string', anchor, utils.rerender);
    userEvent.click(screen.getByText('object'));
    expect(mockHandleBlur).toHaveBeenCalledWith();
  });
  test('should show confirm dialog when old data type is of object and new data type is not of object', () => {
    const {utils} = initFunction('object', null);

    userEvent.click(screen.getByText('object'));
    expect(mockSetAnchorel).toHaveBeenCalledTimes(1);
    initFunction('object', anchor, utils.rerender);
    userEvent.click(screen.getByText('number'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Since only an "object" or "[object]" data type can have child rows,', {exact: false})).toBeInTheDocument();
    userEvent.click(screen.getByText('Confirm'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateDataType('somenodekey', 'number')
    );
    expect(mockHandleBlur).toHaveBeenCalledWith();
  });
  test('should show confirm dialog when old data type is of objectArray and new data type is not of object or object Array', () => {
    const {utils} = initFunction('objectarray');

    userEvent.click(screen.getByText('[object]'));
    expect(mockSetAnchorel).toHaveBeenCalledTimes(1);
    initFunction('objectarray', anchor, utils.rerender);
    userEvent.click(screen.getByText('number'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Since only an "object" or "[object]" data type can have child rows,', {exact: false})).toBeInTheDocument();

    userEvent.click(screen.getByText('Confirm'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateDataType('somenodekey', 'number')
    );
    expect(mockHandleBlur).toHaveBeenCalledWith();
  });
});
