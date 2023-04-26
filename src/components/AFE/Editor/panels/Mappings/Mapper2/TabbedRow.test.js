import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore, mutateStore} from '../../../../../../test/test-utils';
import TabbedRow from './TabbedRow';
import actions from '../../../../../../actions';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.mapping = { mapping: {
    v2TreeData: [
      {
        key: 'ZH_4fXPjHcI0-gZhL8c4U',
        children: [
          {
            key: 'qruRI-RD35w_UbFrJz_m5',
            title: '',
            dataType: 'objectarray',
            disabled: false,
            parentExtract: '',
            parentKey: 'ZH_4fXPjHcI0-gZhL8c4U',
            extractsWithoutMappings: '$[*].name4',
            extractsArrayHelper: [
              {
                extract: '$[*].name1',
                sourceDataType: 'string',
              },
              {
                extract: '$[*].name2',
                sourceDataType: 'string',
              },
              {
                extract: '$[*].name3',
                sourceDataType: 'string',
                copySource: 'yes',
              },
              {
                extract: '$[*].name4',
                sourceDataType: 'string',
                disabled: true,
                disabledInfo: 'this tab is disbaled',
              },
            ],
            sourceDataType: 'objectarray',
            activeTab: 0,
          },
        ],
        generateDisabled: true,
        sourceDataType: 'objectarray',
      },
    ],
  }};
});

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('tabbedRow test case', () => {
  test('should make a dispatch call when a tab is selected', async () => {
    renderWithProviders(<TabbedRow parentKey="qruRI-RD35w_UbFrJz_m5" />, {initialStore});
    const tabs = screen.getAllByRole('tab');

    await userEvent.click(tabs[1]);
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.changeArrayTab('qruRI-RD35w_UbFrJz_m5', 1, '$[*].name2')
    );
  });
  test('should show tab 3 and 4 as disabled', () => {
    renderWithProviders(<TabbedRow parentKey="qruRI-RD35w_UbFrJz_m5" />, {initialStore});
    const tabs = screen.getAllByRole('tab');

    expect(tabs[2]).toBeDisabled();
    expect(tabs[3]).toBeDisabled();
    expect(screen.getByLabelText('No fields need to be configured because this source has the setting "Copy an object array from the source as-is" set to "Yes".')).toBeInTheDocument();
    expect(screen.getByLabelText('No matching fields in this tab')).toBeInTheDocument();
  });

  test('should show no tabs when no tabs provided', () => {
    renderWithProviders(<TabbedRow parentKey="qruRI-RD35w_UbFrJz_m5" />);
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });
});
