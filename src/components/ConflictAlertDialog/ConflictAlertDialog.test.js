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
  test('should test when store is not having any value', () => {
    const {utils} = renderWithProviders(<ConflictAlertDialog />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should test when some value is present in the store commmit conflict', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: '12'}], 'scope'));

    expect(screen.getByText('Resource conflict for resourceId: 1')).toBeInTheDocument();
    expect(screen.getByText('//')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('should test for non string value', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: 12}], 'scope'));

    expect(screen.getByText('Resource conflict for resourceId: 1')).toBeInTheDocument();
    expect(screen.getByText('//')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('should click on refresh button', () => {
    const {store} = renderWithProviders(<ConflictAlertDialog />);

    store.dispatch(actions.resource.commitConflict('1', [{path: '//', value: '12'}], 'scope'));

    const refresh = screen.getByText('Refresh');

    userEvent.click(refresh);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
