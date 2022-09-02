/* global describe, test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SortableDragHandle } from './SortableHandle';
import { renderWithProviders } from '../../test/test-utils';

describe('Sortable Handle', () => {
  test('Should be able to verify the sortable handle when isvisible and draggable are set to true', () => {
    const props = {
      isVisible: true,
      draggable: true,
    };

    renderWithProviders(
      <SortableDragHandle {...props} />
    );
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
  });
  test('Should be able to verify the sortable handle when isvisible and draggable are set to false', () => {
    const props = {
      isVisible: false,
      draggable: false,
    };

    const {utils} = renderWithProviders(
      <SortableDragHandle {...props} />
    );

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
  test('Should be able to verify the sortable handle when isvisible is set to true and draggable is set to false', () => {
    const props = {
      isVisible: true,
      draggable: false,
    };

    renderWithProviders(
      <SortableDragHandle {...props} />
    );

    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
  });
  test('Should be able to verify the sortable handle when isvisible is set to false and draggable is true to false', () => {
    const props = {
      isVisible: false,
      draggable: true,
    };

    const {utils} = renderWithProviders(
      <SortableDragHandle {...props} />
    );

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
});
