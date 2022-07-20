/* global describe, test, expect, */
import React from 'react';
import { screen } from '@testing-library/react';
import TimeAgo from 'react-timeago';
import CeligoTimeAgo from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('CeligoTimeAgo UI tests', () => {
  function renderFunction(date) {
    const {store} = renderWithProviders(<CeligoTimeAgo date={date} />);
    const profile = {timezone: 'Asia/Kolkata'};

    store.dispatch(actions.user.profile.update(profile));

    return store;
  }
  test('should run when date is not provided', () => {
    renderFunction(null);

    const RelativeDateTime = screen.queryByLabelText('relative date time');
    const LocalDateTime = screen.queryByLabelText('local date time');

    expect(RelativeDateTime).not.toBeInTheDocument();
    expect(LocalDateTime).not.toBeInTheDocument();
  });

  test('should test the relative time date', () => {
    renderFunction('2022-05-18T18:16:31.989Z');
    const RelativeDateTime = screen.getByLabelText('relative date time');

    expect(RelativeDateTime).toBeInTheDocument();

    const relativeTime = screen.getByText('05/18/2022 11:46:31 pm');

    expect(relativeTime).toBeInTheDocument();
  });

  test('should test the local time date', () => {
    const store = renderFunction('2022-05-18T18:16:31.989Z');
    const preferencesPayload = {showRelativeDateTime: true};

    store.dispatch(actions.user.preferences.update(preferencesPayload));

    const localDateTime = screen.getByLabelText('local date time');

    renderWithProviders(<TimeAgo date="2022-05-18T18:16:31.989Z" aria-label="sample" />);
    const testforlocalDateTime = screen.getByLabelText('sample');

    expect(localDateTime).toHaveTextContent(testforlocalDateTime.textContent);
  });
  test('should test the condition for just Now', () => {
    const today = new Date();

    const {store} = renderWithProviders(<CeligoTimeAgo date={today} />);
    const preferencesPayload = {showRelativeDateTime: true};

    store.dispatch(actions.user.preferences.update(preferencesPayload));

    const justNow = screen.queryByText(/Just now/i);

    expect(justNow).toBeInTheDocument();
  });
});

