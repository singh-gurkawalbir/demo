
import React from 'react';
import {screen} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import DateTimeDisplay from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('Date and time UI tests', () => {
  function renderFunction(date = null, dateTime = null) {
    const {store} = renderWithProviders(<DateTimeDisplay date={date} dateTime={dateTime} />);
    const resourceType = 'preferences';
    const profile = {timezone: 'Asia/Kolkata'};

    act(() => { store.dispatch(actions.user.profile.update(profile)); });
    act(() => { store.dispatch(actions.resource.received(resourceType, {})); });
  }
  test('should run when no date is provided', () => {
    renderFunction();
    const dateTime = screen.queryByText('05/18/2022 11:46:31 pm');

    expect(dateTime).not.toBeInTheDocument();
  });

  test('should test only when date is provided', () => {
    renderFunction('2022-05-18');
    const date = screen.getByText('05/18/2022');

    expect(date).toHaveTextContent('05/18/2022');
  });

  test('should test when both Date and Time is provided', () => {
    renderFunction(null, '2022-05-18T18:16:31.989Z');
    const dateTime = screen.getByText('05/18/2022 11:46:31 pm');

    expect(dateTime).toHaveTextContent('05/18/2022 11:46:31 pm');
  });
});

