
import React from 'react';
import ExpiredOn from '.';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

let initialStore;

function initExpiredOn(date, dateFormatData) {
  mutateStore(initialStore, draft => {
    draft.user.preferences = {
      dateFormat: dateFormatData,
    };
  });
  const ui = (
    <ExpiredOn date={date} />
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  TimeAgo: () => 'Mock Celigo Time Ago',
}));

describe('testsuite for Expired On', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('29 Oct 2022 00:00:00 GMT').getTime());
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('should test the rendered expired on date', () => {
    initExpiredOn('10/30/2022', 'MM/DD/YYYY');
    expect(document.querySelector('p').textContent).toBe('10/30/2022 (Mock Celigo Time Ago)');
  });
  test('should test the rendered expired on date when there is no time format set in profile', () => {
    initExpiredOn('10/30/2022');
    expect(document.querySelector('p').textContent).toBe('Oct 30, 2022 (Mock Celigo Time Ago)');
  });
  test('should test the expired on when there is no date', () => {
    initExpiredOn('');
    expect(document.querySelector('div').textContent).not.toBe('Oct 30, 2022 (Mock Celigo Time Ago)');
  });
  test('should test the warning class name when the licence is about to expire', () => {
    initExpiredOn('11/02/2022');
    expect(document.querySelector('p').className).toEqual(expect.stringContaining('makeStyles-warning-'));
  });
  test('should test the error class name when the licence is expired', () => {
    initExpiredOn('10/28/2022');
    expect(document.querySelector('p').className).toEqual(expect.stringContaining('makeStyles-error-'));
  });
});

