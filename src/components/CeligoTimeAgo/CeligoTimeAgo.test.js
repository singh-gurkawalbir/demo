
import React from 'react';
import { screen } from '@testing-library/react';
import TimeAgo from 'react-timeago';
import { act } from 'react-dom/test-utils';
import CeligoTimeAgo from '.';
import { mockPutRequestOnce, renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';
import { runServer } from '../../test/api/server';

describe('celigoTimeAgo UI tests', () => {
  runServer();
  function renderFunction(date = null, showRelativeDateTime = null) {
    const {store} = renderWithProviders(<CeligoTimeAgo date={date} />);
    const profile = {timezone: 'Asia/Kolkata'};

    act(() => { store.dispatch(actions.user.profile.update(profile)); });
    if (showRelativeDateTime) {
      const preferencesPayload = {showRelativeDateTime: true};

      act(() => { store.dispatch(actions.user.preferences.update(preferencesPayload)); });
    }

    return store;
  }
  test('should run when date is not provided', () => {
    const mockResolverFunction2 = jest.fn();

    mockPutRequestOnce('/api/profile', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });

    renderFunction();

    const relativeDateTime = screen.queryByLabelText('relative date time');
    const localDateTime = screen.queryByLabelText('local date time');

    expect(relativeDateTime).not.toBeInTheDocument();
    expect(localDateTime).not.toBeInTheDocument();
  });

  test('should test the relative time date', () => {
    const mockResolverFunction2 = jest.fn();

    mockPutRequestOnce('/api/profile', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });

    renderFunction('2022-05-18T18:16:31.989Z');
    const relativeDateTime = screen.getByLabelText('relative date time');

    expect(relativeDateTime).toBeInTheDocument();

    const relativeTime = screen.getByText('05/18/2022 11:46:31 pm');

    expect(relativeTime).toBeInTheDocument();
  });

  test('should test the local time date', () => {
    const mockResolverFunction2 = jest.fn();

    mockPutRequestOnce('/api/profile', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });

    renderFunction('2022-05-18T18:16:31.989Z', true);

    const localDateTime = screen.getByLabelText('local date time');

    renderWithProviders(<TimeAgo date="2022-05-18T18:16:31.989Z" aria-label="sample" />);
    const testforlocalDateTime = screen.getByLabelText('sample');

    expect(localDateTime).toHaveTextContent(testforlocalDateTime.textContent);
  });
  test('should test the condition for just Now', () => {
    const mockResolverFunction2 = jest.fn();

    mockPutRequestOnce('/api/profile', (req, res, ctx) => {
      mockResolverFunction2();

      return res(ctx.json([]));
    });

    const today = new Date();

    renderFunction(today, true);

    const justNow = screen.queryByText(/Just now/i);

    expect(justNow).toBeInTheDocument();
  });
});

