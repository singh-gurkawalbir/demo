/* global describe, test, expect, */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RawHtml from '.';
import {renderWithProviders} from '../../test/test-utils';

describe('RawHtml UI tests', () => {
  test('normal render', () => {
    const props = {
      html: {errors: [{message: 'You exceeded your quota for the requested resource.', code: 'QuotaExceeded'}]},
      options: {
        allowedTags: ['a'],
      },
    };

    renderWithProviders(<MemoryRouter><RawHtml {...props} /></MemoryRouter>);
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument();
    screen.debug();
  });
  test('use case 1 where allowedTags prop is null', () => {
    const props = {
      html: {errors: [{message: 'You exceeded your quota for the requested resource.', code: 'QuotaExceeded'}]},
      options: {allowedTags: null},
    };

    renderWithProviders(<MemoryRouter><RawHtml {...props} /></MemoryRouter>);
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument();
    screen.debug();
  });
  test('use case 2 where options is an empty object', () => {
    const props = {
      html: {errors: [{message: 'You exceeded your quota for the requested resource.', code: 'QuotaExceeded'}]},

    };

    renderWithProviders(<MemoryRouter><RawHtml {...props} /></MemoryRouter>);
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument();
    screen.debug();
  });
});

