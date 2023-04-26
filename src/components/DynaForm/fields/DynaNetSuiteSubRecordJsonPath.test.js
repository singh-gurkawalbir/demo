
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import DynaNetSuiteSubRecordJsonPath from './DynaNetSuiteSubRecordJsonPath';
import { getCreatedStore } from '../../../store';

describe('test suite for netsuite sub-record JSON path field', () => {
  test('should provide only $ as an option if sampleData does not exists', async () => {
    const props = {
      flowId: 'flow123',
      resourceId: 'new-import123',
      label: 'Path to node that contains items data',
    };

    renderWithProviders(<DynaNetSuiteSubRecordJsonPath {...props} />);
    expect(document.querySelector('label')).toHaveTextContent(props.label);

    await userEvent.click(screen.getByRole('textbox'));
    const options = screen.getAllByRole('option').map(ele => ele.textContent);

    expect(options).toEqual(['$']);
  });

  test('should provide the options if sampleData exists', async () => {
    const data = {
      id: '192',
      'recordType[*].key': ['salesorder'],
      Date: '6/30/2012',
      'Ship Date': '',
      'Document[*].Number': ['SLS00000106'],
      Name: 'Jonathan',
      'data[*].Amount[*].value': ['1178.31'],
      'data[*].Amount[*].person': ['John'],
    };
    const props = {
      id: 'jsonPath_item_sublist_celigo_inventorydetail',
      name: 'jsonPath_item_sublist_celigo_inventorydetail',
      flowId: 'flow123',
      resourceId: 'import123',
      label: 'Path to node that contains items data',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.flowData[props.flowId] = {
        pageGeneratorsMap: {},
        pageProcessorsMap: {
          [props.resourceId]: {
            preMap: {
              status: 'received',
              data,
            },
            processedFlowInput: {
              status: 'received',
              data,
            },
            inputFilter: {
              status: 'received',
              data,
            },
            flowInput: {
              status: 'received',
              data,
            },
          },
        },
        pageProcessors: [
          {
            type: 'import',
            _importId: props.resourceId,
          },
        ],
        routers: [],
        refresh: false,
        formKey: 'imports-8lOvKF',
      };
    });

    renderWithProviders(<DynaNetSuiteSubRecordJsonPath {...props} />, { initialStore });
    expect(document.querySelector('label')).toHaveTextContent(props.label);

    await userEvent.click(screen.getByRole('textbox'));
    const options = screen.getAllByRole('option').map(ele => ele.textContent);

    expect(options).toEqual([
      '$',
      'data[*].Amount',
      'Document',
      'recordType',
    ]);
  });
});
