/* global describe, test, expect ,jest */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import DateRangeSelector from '.';
import {AUDIT_LOGS_RANGE_FILTERS} from '../../utils/resource';

describe('DateRangeSelector testing', () => {
  test('testing on clicking apply', () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector onSave={onSave} />);
    const button = screen.getByRole('button');

    userEvent.click(button);
    const selectedfromlist = screen.getByText('Last 4 hours');

    userEvent.click(selectedfromlist);
    const apply = screen.getByText('Apply');

    userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
    expect(screen.getByText('Last 4 hours')).toBeInTheDocument();
    screen.debug();
  });
  test('testing on clsing', () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector onSave={onSave} />);
    const button = screen.getByRole('button');

    userEvent.click(button);
    const selectedfromlist = screen.getByText('Last 4 hours');

    userEvent.click(selectedfromlist);
    const cancel = screen.getByText('Cancel');

    userEvent.click(cancel);
    expect(cancel).not.toBeInTheDocument();
  });

  test('testing on provding custom inputs', () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={AUDIT_LOGS_RANGE_FILTERS} />);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const selectedfromlist = screen.getByText('Last 7 Days');

    userEvent.click(selectedfromlist);
    const apply = screen.getByText('Apply');

    userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
    expect(screen.getByText('Last 7 Days')).toBeInTheDocument();
  });

  test('testing on provding custom input and intial value.preset as custom and calender true', () => {
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

    userEvent.click(button);

    const date = screen.getAllByText('23');/// /later set it to current date

    userEvent.click(date[0]);
    const apply = screen.getByText('Apply');

    userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('testing on provding custom input and intial value.preset as custom and calender false', () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {id: 'custom', label: 'Custom'},
      ]}
      value={{preset: 'custom'}} />);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const date = screen.getAllByText('23');/// /later set it to current date

    userEvent.click(date[0]);
    const apply = screen.getByText('Apply');

    userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('working on last run', () => {
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

    userEvent.click(button);

    const lastrun = screen.getByText('Last run');

    userEvent.click(lastrun);
    const apply = screen.getByText('Apply');

    userEvent.click(apply);
    expect(onSave).toHaveBeenCalled();
  });

  test('profviding clearable option', () => {
    const onSave = jest.fn();

    renderWithProviders(<DateRangeSelector
      clearable
      onSave={onSave} showCustomRangeValue
      customPresets={[
        {id: 'last1hour', label: 'Last hour'},
        {id: 'custom', label: 'Custom'},
      ]} />);

    const button = screen.getByRole('button');

    userEvent.click(button);

    const clear = screen.getByText('Clear');

    userEvent.click(clear);
    expect(onSave).toHaveBeenCalled();
    expect(clear).not.toBeInTheDocument();
  });
});
