
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import KeywordSearch from '.';
import {renderWithProviders} from '../../test/test-utils';
import actions from '../../actions';

describe('KeyWordSearch UI tests', () => {
  test('should update the state correctly when an user input is provided and isHomeSearch is false', async () => {
    const keyWord = {keyword: 'keyword'};
    const {store} = renderWithProviders(<KeywordSearch filterKey="name" />);

    act(() => { store.dispatch(actions.patchFilter('name', keyWord)); });
    const input = screen.getByDisplayValue('');

    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'somtext');
    await waitFor(() => expect(store.getState().session.filters.name.keyword).toBe('somtext'));
  });

  test('should update the state correctly when an user input is provided when isHomeSearch is true', async () => {
    const keyWord = {keyword: 'keyword'};
    const {store} = renderWithProviders(<KeywordSearch filterKey="name" isHomeSearch />);

    act(() => { store.dispatch(actions.patchFilter('name', keyWord)); });
    const input = screen.getByDisplayValue('');

    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'somtext');

    await waitFor(() => expect(store.getState().session.filters.name.keyword).toBe('somtext'));
  });
});
