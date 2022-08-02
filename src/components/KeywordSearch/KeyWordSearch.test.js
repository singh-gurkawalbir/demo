/* global describe, test, expect */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeywordSearch from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('KeyWordSearch testing', () => {
  test('should test when isHomeSearch props is not provided', async () => {
    const keyWord = {keyword: 'keyword'};
    const {store} = renderWithProviders(<KeywordSearch filterKey="name" />);

    store.dispatch(actions.patchFilter('name', keyWord));
    const input = screen.getByDisplayValue('');

    expect(input).toBeInTheDocument();
    userEvent.type(input, 'somtext');
    await waitFor(() => expect(store.getState().session.filters.name.keyword).toBe('somtext'));
  });

  test('should test when isHomeSearch is true', async () => {
    const keyWord = {keyword: 'keyword'};
    const {store} = renderWithProviders(<KeywordSearch filterKey="name" isHomeSearch />);

    store.dispatch(actions.patchFilter('name', keyWord));
    const input = screen.getByDisplayValue('');

    expect(input).toBeInTheDocument();
    userEvent.type(input, 'somtext');

    await waitFor(() => expect(store.getState().session.filters.name.keyword).toBe('somtext'));
  });
});
