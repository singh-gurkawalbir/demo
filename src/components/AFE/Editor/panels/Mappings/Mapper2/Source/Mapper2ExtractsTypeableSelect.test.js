import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../../test/test-utils';
import Mapper2ExtractsTypeableSelect, {TooltipTitle} from './Mapper2ExtractsTypeableSelect';
import actions from '../../../../../../../actions';

jest.mock('../../../../../../icons/ArrowDownIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../../icons/ArrowDownIcon'),
  default: () => (
    <div>Arror Down Icon</div>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.mapping = { mapping: {
    v2TreeData: [
      {
        key: 'FqGvhEBdGWeHAGUgYL3Mu',
        title: '',
        disabled: false,
        jsonPath: '',
        isRequired: false,
        dataType: 'objectarray',
        status: 'Draft',
        buildArrayHelper: [
          {
            sourceDataType: 'string',
            mappings: [
              {
                extract: 'erfrfer',
                generate: 'qrf',
                dataType: 'string',
                conditional: {
                  when: 'extract_not_empty',
                },
                description: 'qwewqecf',
                status: 'Active',
                sourceDataType: 'string',
              },
            ],
          },
        ],
        extractsArrayHelper: [],
        children: [
          {
            key: 'ahYENcMLnar21Vj9D5ZaX',
            title: '',
            parentKey: 'FqGvhEBdGWeHAGUgYL3Mu',
            parentExtract: '',
            disabled: false,
            jsonPath: 'qrf',
            isRequired: false,
            extract: 'erfrfer',
            generate: 'qrf',
            dataType: 'string',
            conditional: {
              when: 'extract_not_empty',
            },
            description: 'qwewqecf',
            status: 'Active',
            sourceDataType: 'string',
          },
        ],
        generateDisabled: true,
      },
    ],
    extractsTree: [
      {
        key: 'qlrqNeQd2w0tRxf6wi-FC',
        title: '',
        dataType: '[object]',
        propName: '$',
        children: [
          {
            key: 'BvbVNA8mHa87KFS-kZxyQ',
            parentKey: 'qlrqNeQd2w0tRxf6wi-FC',
            title: '',
            jsonPath: 'name',
            propName: 'name',
            dataType: 'string',
          },
        ],
      },
    ],
  }};
});
const onBlur = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('mapper2ExtractsTypeableSelect UI test case', () => {
  test('should make dispatch call when the data type of Source field is changed to number', async () => {
    renderWithProviders(<MemoryRouter><Mapper2ExtractsTypeableSelect onBlur={onBlur} /></MemoryRouter>);
    await userEvent.type(screen.getByPlaceholderText('Source field'), 'Value');
    await userEvent.click(screen.getByText('Arror Down Icon'));
    waitFor(() => {
      const exrtactPopper = screen.getByRole('tooltip');

      expect(exrtactPopper).toBeInTheDocument();
      expect(exrtactPopper).toHaveAttribute('id', 'extractPopper');
    });
  });
  test('should click on Arrow down iconand choose an option call onBlur with new value', async () => {
    renderWithProviders(<MemoryRouter><Mapper2ExtractsTypeableSelect onBlur={onBlur} /></MemoryRouter>, {initialStore});
    await userEvent.click(screen.getByText('Arror Down Icon'));
    await userEvent.click(screen.getByText('name'));

    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.patchExtractsFilter('', '')
    );
    expect(onBlur).toHaveBeenCalledWith('$.name', 'name');
  });
  describe('tooltipTitle test cases', () => {
    test('should show the field type as tooltip when tooltip is neighter truncated nor source dropdown is hidden', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A,B"
        fieldType="someFieldType"
      />);
      expect(screen.getByText('someFieldType')).toBeInTheDocument();
    });
    test('should show the field type and input value when souce dropdown is hidden and lookup is not of dynamic type', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A"
        isTruncated
        fieldType="someFieldType"
        isDynamicLookup={false}
      />);
      expect(screen.getByText('someFieldType: A')).toBeInTheDocument();
    });
    test('should show the field type and input value and hrizontaline when souce dropdown is not hidden and lookup is not of dynamic type', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A"
        isTruncated
        fieldType="someFieldType"
        hideSourceDropdown
        isDynamicLookup={false}
      />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('someFieldType: A')).toBeInTheDocument();
    });
    test('should show the field type and input value and hrizontaline when souce dropdown is not hidden and lookup is not of dynamic type duplicate', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A,B"
        isSource
        isTruncated
        fieldType="someFieldType"
        hideSourceDropdown
        isDynamicLookup={false}
        sourceDataTypes={['string', 'number']}
      />);

      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('Source field / data type:')).toBeInTheDocument();
      expect(screen.getByText('A / string')).toBeInTheDocument();
      expect(screen.getByText('B / number')).toBeInTheDocument();
    });
    test('should hide dropdown with message "Dynamic lookups values do not provide source field list"', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A,B"
        isSource
        isTruncated
        hideSourceDropdown
        isDynamicLookup
      />);

      expect(screen.getByText('Dynamic lookups do not provide source field list')).toBeInTheDocument();
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('Source field / data type:')).toBeInTheDocument();
    });
    test('should hide dropdown with message "Hard-coded values do not provide source field list"', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A,B"
        isSource
        isTruncated
        hideSourceDropdown
        isHardCodedValue
      />);

      expect(screen.getByText('Hard-coded values do not provide source field list')).toBeInTheDocument();
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('Source field / data type:')).toBeInTheDocument();
    });
    test('should hide dropdown with message "Handlebars expression do not provide source field list"', () => {
      renderWithProviders(<TooltipTitle
        inputValue="A,B"
        isSource
        isTruncated
        hideSourceDropdown
        isHandlebarExp
      />);

      expect(screen.getByText('Handlebars expression do not provide source field list')).toBeInTheDocument();
      expect(screen.getByRole('separator')).toBeInTheDocument();
      expect(screen.getByText('Source field / data type:')).toBeInTheDocument();
    });
  });
});
