/* global describe, test, expect  */
import React from 'react';
import {screen} from '@testing-library/react';
import DateTimeDisplay from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('Date and time component test', () => {
  test('With no input test ', () => {
    const {store} = renderWithProviders(<DateTimeDisplay />);
    const resourceType = 'preferences';

    store.dispatch(actions.resource.received(resourceType, {}));
    const dateTime = screen.queryByText('05/18/2022 11:46:31 pm');

    expect(dateTime).not.toBeInTheDocument();
  });

  test('Only Date condition test', () => {
    const {store} = renderWithProviders(<DateTimeDisplay date="2022-05-18" />);
    const resourceType = 'preferences';

    store.dispatch(actions.resource.received(resourceType, {}));
    const date = screen.getByText('05/18/2022');

    expect(date).toHaveTextContent('05/18/2022');
  });

  test('DateTime condition test', () => {
    const {store} = renderWithProviders(<DateTimeDisplay dateTime="2022-05-18T18:16:31.989Z" />);
    const resourceType = 'preferences';
    const profile = {timezone: 'Asia/Kolkata'};

    store.dispatch(actions.user.profile.update(profile));
    store.dispatch(actions.resource.received(resourceType, {}));
    screen.debug();
    const dateTime = screen.getByText('05/18/2022 11:46:31 pm');

    expect(dateTime).toHaveTextContent('05/18/2022 11:46:31 pm');
  });
});
