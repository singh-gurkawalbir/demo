import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../../test/test-utils';
import ExtractsTree from './ExtractsTree';

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
            title: 'someTitle',
            jsonPath: 'name',
            propName: 'name',
            dataType: 'string',
          },
          {
            key: 'BvbVNA8mHa87KFS-kZxyR',
            parentKey: 'qlrqNeQd2w0tRxf6wi-FC',
            hidden: false,
            jsonPath: '2name',
            propName: '2name',
            dataType: 'stringarray',
          },
        ],
      },
    ],
  }};
});

const setInputValue = jest.fn();
const setIsFocused = jest.fn();
const patchField = jest.fn();

describe('extract tress Ui test cases', () => {
  test('should call patch field with new value and the jason path', async () => {
    renderWithProviders(<ExtractsTree
      destDataType="string" propValue="propValue" propName="somepropName" setInputValue={setInputValue}
      setIsFocused={setIsFocused}
      patchField={patchField} />, {initialStore});
    const treeTitle = screen.getByTitle('someTitle');

    expect(treeTitle.textContent).toBe('namestring');
    await userEvent.click(screen.getByText('name'));
    expect(setInputValue).toHaveBeenCalledWith('$.name');
    expect(setIsFocused).toHaveBeenCalledWith(false);
    expect(patchField).toHaveBeenCalledWith('propValue', '$.name', 'name');
  });
  test('should check the heading for the source data type of array', () => {
    renderWithProviders(<ExtractsTree
      destDataType="stringarray" propValue="propValue" propName="somepropName" setInputValue={setInputValue}
      setIsFocused={setIsFocused}
      patchField={patchField} />, {initialStore});
    expect(screen.getByText('Type or select source field')).toBeInTheDocument();
    expect(screen.getByText('Separate fields with a comma (,)')).toBeInTheDocument();
    expect(screen.getByText('For sources that are not listed below, enter data types in Settings')).toBeInTheDocument();
  });
  test('should show empty dome element when no store are prvided', () => {
    const {utils} = renderWithProviders(<ExtractsTree
      destDataType="string" propValue="propValue" propName="somepropName" setInputValue={setInputValue}
      setIsFocused={setIsFocused}
      patchField={patchField} />);

    expect(utils.container).toBeEmptyDOMElement();
  });
});
