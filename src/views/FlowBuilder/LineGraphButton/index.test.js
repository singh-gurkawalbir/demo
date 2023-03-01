
import React from 'react';
import userEvent from '@testing-library/user-event';
import {mutateStore, reduxStore, renderWithProviders} from '../../../test/test-utils';
import LineGraphButton from '.';

const initialStore = reduxStore;

function initLineGraphButton(props) {
  mutateStore(initialStore, draft => {
    draft.data.resources.flows = [{
      _id: '62c6f122a2f4a703c3dee3d0',
      lastModified: '2022-07-07T14:46:06.187Z',
      name: 'New flow',
      disabled: false,
      _integrationId: '6253af74cddb8a1ba550a010',
      skipRetries: false,
      pageProcessors: [
        {
          responseMapping: {
            fields: [],
            lists: [],
          },
          type: 'import',
          _importId: '62c6f15aae93a81493321a87',
        },
      ],
      pageGenerators: [
        {
          _exportId: '62c6f121a2f4a703c3dee3ce',
          skipRetries: false,
        },
      ],
      createdAt: '2022-07-07T14:43:46.730Z',
      lastExecutedAt: '2022-07-07T14:46:57.185Z',
      autoResolveMatchingTraceKeys: true,
    }];
    draft.session.errorManagement.latestFlowJobs = {
      '62c6f122a2f4a703c3dee3d0': {
        status: props.status,
        data: [
          {
            _id: '62c6f1bcae93a81493321aa1',
            lastModified: '2022-07-07T14:46:57.191Z',
            lastExecutedAt: props.last,
          },
        ],
      },
    };
  });

  return renderWithProviders(<LineGraphButton {...props} />, {initialStore});
}

describe('LineGraphButton UI tests', () => {
  test('should pass the initial render', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', onClickHandler: jest.fn()};

    initLineGraphButton(props);
    const LineGraphButon = document.querySelector('[ data-test="charts"]');

    expect(LineGraphButon).toBeInTheDocument();
  });
  test('should render disabled button when flow does not contain lastExecuted time', () => {
    const props = {flowId: '62c6f122a2f4a703c3dee3d1', onClickHandler: jest.fn()};

    initLineGraphButton(props);
    const LineGraphButon = document.querySelector('[ data-test="charts"]');

    expect(LineGraphButon).toBeDisabled();
  });
  test('should run the onClickHandler function passed in props', async () => {
    const mockOnClickHandler = jest.fn();
    const props = {flowId: '62c6f122a2f4a703c3dee3d0', onClickHandler: mockOnClickHandler};

    initLineGraphButton(props);
    const LineGraphButon = document.querySelector('[ data-test="charts"]');

    await userEvent.click(LineGraphButon);
    expect(mockOnClickHandler).toBeCalledWith('charts');
  });
});
