/* global describe, test, beforeEach, jest, expect, afterEach */
import React from 'react';
import ExpiredOn from '.';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';

let initialStore;

function initExpiredOn(date, dateFormatData) {
  initialStore.getState().user.preferences = {
    dateFormat: dateFormatData,
  };
  const ui = (
    <ExpiredOn date={date} />
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../CeligoTimeAgo', () => ({
  __esModule: true,
  ...jest.requireActual('../../../CeligoTimeAgo'),
  default: () => 'Mock Celigo Time Ago',
}));

describe('Testsuite for Expired On', () => {
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
    expect(document.querySelector('p').textContent).toEqual('10/30/2022 (Mock Celigo Time Ago)');
  });
  test('should test the rendered expired on date when there is no time format set in profile', () => {
    initExpiredOn('10/30/2022');
    expect(document.querySelector('p').textContent).toEqual('Oct 30, 2022 (Mock Celigo Time Ago)');
  });
  test('should test the expired on when there is no date', () => {
    initExpiredOn('');
    expect(document.querySelector('div').textContent).not.toEqual('Oct 30, 2022 (Mock Celigo Time Ago)');
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

