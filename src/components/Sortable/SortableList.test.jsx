/* global describe, test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import SortableListWrapper from './SortableList';

describe('Sortable List', () => {
  test('Should able to render the sortable list', () => {
    const props = {
      children: 1,
    };

    render(
      <SortableListWrapper {...props} />
    );
    const test = screen.getByText('1');

    expect(test).toBeInTheDocument();
  });
});
