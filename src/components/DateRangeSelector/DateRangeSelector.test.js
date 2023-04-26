
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import DateRangeSelector from '.';
import {AUDIT_LOGS_RANGE_FILTERS} from '../../utils/resource';

describe('dateRangeSelector testing', () => {
  test('should test when click on apply', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector onSave={onSave} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    const selectedfromlist = screen.getByText('Last 4 hours');

    await userEvent.click(selectedfromlist);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
    expect(screen.getByText('Last 4 hours')).toBeInTheDocument();
  });
  test('should test cancel button', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector onSave={onSave} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    const selectedfromlist = screen.getByText('Last 4 hours');

    await userEvent.click(selectedfromlist);
    const cancel = screen.getByText('Cancel');

    await userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });

  test('should test when custom input are provided', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={AUDIT_LOGS_RANGE_FILTERS} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);
    await waitFor(() => expect(screen.queryByText('Last 7 days')).toBeInTheDocument());

    const selectedfromlist = screen.getByText('Last 7 days');

    await userEvent.click(selectedfromlist);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText('Last 7 days')).toBeInTheDocument());
  });

  test('should test providing custom input and intial value.preset as custom and calender true', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {id: 'custom', label: 'Custom'},
      ]}
      value={{preset: 'custom'}}
      isCalendar />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const date = screen.getAllByText('10');

    await userEvent.click(date[0]);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('should test when providing custom input and intial value.preset as custom and calender false', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {id: 'custom', label: 'Custom'},
      ]}
      value={{preset: 'custom'}} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);
    const date = screen.getAllByText('10');

    await userEvent.click(date[0]);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('should test the last run option', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {
          label: 'Last run',
          id: 'lastrun',
          range: () => ({
            startDate: '2022-05-24T18:30:00.000Z',
            endDate: '2022-06-23T10:51:44.122Z',
          }),
        },
        {id: 'custom', label: 'Custom'},
      ]} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const lastrun = screen.getByText('Last run');

    await userEvent.click(lastrun);
    const apply = screen.getByText('Apply');

    await userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('should clearable button', async () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      clearable
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {id: 'custom', label: 'Custom'},
      ]} />);

    const button = screen.getByRole('button');

    await userEvent.click(button);

    const clear = screen.getByText('Clear');

    await userEvent.click(clear);
    expect(onSave).toHaveBeenCalled();
    expect(clear).not.toBeInTheDocument();
  });
});
