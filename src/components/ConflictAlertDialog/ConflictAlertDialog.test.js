/* global describe, test, expect ,jest, beforeAll, afterAll */
import React from 'react';
import { screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../test/test-utils';
import ConflictAlertDialog from '.';
import actions from '../../actions/index';

const { location } = window;

describe('ConflictAlertDialog testing', () => {
  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });
  test('rendering nothingh', () => {
    renderWithProviders(<ConflictAlertDialog />);
    screen.debug();
  });
  test('rendering', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: '12'}], 'scope'));

    console.log(store?.getState()?.session.stage);
    screen.debug();
  });

  test('rendering with non string value', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: 12}], 'scope'));

    screen.debug();
  });

  test('onclicking refresh button', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: '12'}], 'scope'));

    const refresh = screen.getByText('Refresh');

    userEvent.click(refresh);
    expect(window.location.reload).toHaveBeenCalled();
    screen.debug();
  });
});
