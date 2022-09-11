/* global describe, test, expect, */
import React from 'react';
import { screen } from '@testing-library/react';
import RawHtml from '.';
import {renderWithProviders} from '../../test/test-utils';

describe('RawHtml UI tests', () => {
  test('should pass the initial render', () => {
    const props = {
      options: {
        allowedTags: ['a'],
      },
    };

    renderWithProviders(<RawHtml html={<>This is <strong>not</strong> working.</>} {...props} />);
    screen.debug();
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument(); // '[object Object]' is the text displayed when the html passed as props is displayed on browser//
  });
  test('should pass the render when allowedTags prop is null', () => {
    const props = {
      options: {allowedTags: null},
    };

    renderWithProviders(<RawHtml html={<>This is <strong>not</strong> working.</>} {...props} />);
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument();
  });
  test('should pass the render when options is an empty object', () => {
    renderWithProviders(<RawHtml html={<>This is <strong>not</strong> working.</>} />);
    expect(screen.getByText(/[object Object]/i)).toBeInTheDocument();
  });
});

