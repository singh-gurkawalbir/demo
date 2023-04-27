import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaReportDateRange from './DynaReportDateRange';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

const mockonFieldChange = jest.fn();

function initDynaReportDateRange(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      formKey: {
        fields: {
          integration: {
            value: '5b3c75dd5d3c125c88b5dd20',
          },
        },
      },
    };
  });

  return renderWithProviders(<DynaReportDateRange {...props} />, {initialStore});
}

jest.mock('../../../icons/ArrowDownIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../icons/ArrowDownIcon'),
  default: () => (
    <div>Icon button</div>

  ),
}));

describe('dynaReportDateRange UI tests', () => {
  const props = {
    formKey: 'formKey',
    id: 'testId',
    onFieldChange: mockonFieldChange,
    value: {},
    label: 'Resource',
    child: {
      function: jest.fn(),
    },
    defaultPreset: {
      startDate: '1',
      endDate: '2',
      preset: 'custom',
    },
    disabled: false,
    isLoggable: true,
  };

  test('should pass the initial render', () => {
    initDynaReportDateRange(props);
    expect(screen.getByText('Resource')).toBeInTheDocument();
    expect(screen.getByText('Select range')).toBeInTheDocument();
  });
  test('should display the date ranges when clicked on Select range option', async () => {
    initDynaReportDateRange(props);
    expect(screen.getByText('Select range')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Select range'));
    expect(screen.getByText(/last minute/i)).toBeInTheDocument();
    expect(screen.getByText(/last 5 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/last 15 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/last 30 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/last hour/i)).toBeInTheDocument();
    expect(screen.getByText(/last 6 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/last 12 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/last 24 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/custom/i)).toBeInTheDocument();
  });

  test('should open the calendar view to select start and end date when clicked on Custom preset', async () => {
    initDynaReportDateRange(props);
    await userEvent.click(screen.getByText('Select range'));
    await userEvent.click(screen.getByText('Custom'));
    expect(screen.getByLabelText(/Start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End time/i)).toBeInTheDocument();
    const months = screen.getAllByText(/[a-zA-Z]{3} [0-9]{4}\s*/g);

    expect(months).toHaveLength(3);
    expect(screen.getAllByText('Sun')).toHaveLength(2);
    expect(screen.getAllByText('Sat')).toHaveLength(2);
    expect(screen.getByText('You can generate a report for up to 3 days of data.')).toBeInTheDocument();
  });

  test('should display the range in the field when range is already passed', () => {
    initDynaReportDateRange({...props,
      value: {
        startDate: '2022-12-09T18:30:00.000',
        endDate: '2022-12-10T18:55:13.184',
        preset: 'custom',
      },
    });
    expect(screen.getByText('09/12/22-10/12/22')).toBeInTheDocument();
  });
  test('should call the onFieldChange function passed in props when clicked on apply button', async () => {
    initDynaReportDateRange(props);
    await userEvent.click(screen.getByText('Select range'));
    await userEvent.click(screen.getByText(/last minute/i));
    const applyButton = screen.getByText(/Apply/i);

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalled());
  });
  test('should not render the calendar views when preset is other than custom', async () => {
    initDynaReportDateRange(props);
    await userEvent.click(screen.getByText('Select range'));
    await userEvent.click(screen.getByText(/last minute/i));
    expect(screen.queryByText(/Dec 2022/i)).toBeNull();
    expect(screen.queryByText(/Jan 2023/i)).toBeNull();
  });
});
