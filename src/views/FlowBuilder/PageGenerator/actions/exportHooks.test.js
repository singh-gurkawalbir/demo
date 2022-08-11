/* global describe, test, expect, jest, */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router, Route } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import { renderWithProviders} from '../../../../test/test-utils';
import exportHooks from './exportHooks';

describe('ExportHooks UI tests', () => {
  test('should test name, position and helpKey', () => {
    const {helpKey, name, position} = exportHooks;

    expect(name).toBe('exportHooks');
    expect(position).toBe('right');
    expect(helpKey).toBe('fb.pg.exports.hooks');
  });
  test('should test ExportHooks component when open props is not sent', () => {
    const {Component} = exportHooks;

    const {utils} = renderWithProviders(<MemoryRouter><Component /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();

    screen.debug();
  });
  test('should test ExportHooks component when open props is sent', () => {
    const {Component} = exportHooks;
    const onClose = jest.fn();
    const history = createMemoryHistory({ initialEntries: ['/someInitialURL']});

    renderWithProviders(
      <Router history={history}>
        <Route path="/:path">
          <Component open onClose={onClose} resourceType="resourceType" resourceId="resourceId" />
        </Route>
      </Router>);
    expect(history.location.pathname).toBe('/someInitialURL/hooks/resourceType/resourceId');
    expect(onClose).toHaveBeenCalled();

    screen.debug();
  });
});
