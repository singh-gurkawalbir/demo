/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import CeligoTimeAgo from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('CeligoTimeAgo component test', () => {
  test('rendereding nothing', () => {
    renderWithProviders(<MemoryRouter><CeligoTimeAgo date="" /></MemoryRouter>);

    const RelativeDateTime = screen.queryByLabelText('relative date time');
    const LocalDateTime = screen.queryByLabelText('local date time');

    expect(RelativeDateTime).not.toBeInTheDocument();
    expect(LocalDateTime).not.toBeInTheDocument();
  });

  test('rendereding with relative time date', () => {
    const {store} = renderWithProviders(<MemoryRouter><CeligoTimeAgo date="2022-05-18T18:16:31.989Z" /></MemoryRouter>);
    const RelativeDateTime = screen.getByLabelText('relative date time');
    const profile = {timezone: 'Asia/Kolkata'};

    // actionTypes.USER.PROFILE.UPDATE
    store.dispatch(actions.user.profile.update(profile));

    expect(RelativeDateTime).toBeInTheDocument();

    const relativeTime = screen.getByText('05/18/2022 11:46:31 pm');

    expect(relativeTime).toBeInTheDocument();
  });

  test('rendereding with local time date', () => {
    const {store} = renderWithProviders(<MemoryRouter><CeligoTimeAgo date="2022-05-18T18:16:31.989Z" /></MemoryRouter>);
    const preferencesPayload = {showRelativeDateTime: true};

    store.dispatch(actions.user.preferences.update(preferencesPayload));

    const localDateTime = screen.getByLabelText('local date time');

    renderWithProviders(<TimeAgo date="2022-05-18T18:16:31.989Z" aria-label="sample" />);
    const testforlocalDateTime = screen.getByLabelText('sample');

    expect(localDateTime).toHaveTextContent(testforlocalDateTime.textContent);
  });
  test('rendereding just Now', () => {
    const today = new Date();

    const {store} = renderWithProviders(<MemoryRouter><CeligoTimeAgo date={today} /></MemoryRouter>);
    const preferencesPayload = {showRelativeDateTime: true};

    store.dispatch(actions.user.preferences.update(preferencesPayload));

    const justNow = screen.queryByText(/Just now/i);

    expect(justNow).toBeInTheDocument();
  });
});

