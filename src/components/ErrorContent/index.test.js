/* global describe, test, expect, jest */
import React from 'react';
import {screen} from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import ErrorContent from '.';

// mocking of child components
jest.mock('../JsonContent', () => () => {
  const MockJson = () => <div>Json error displayed</div>;

  return <MockJson />;
});
jest.mock('../RawHtml', () => () => {
  const MockHtml = () => <div>Html error displayed</div>;

  return <MockHtml />;
});

const sampleJson = '{"name":"John", "age":30, "city":"New York"}';
const sampleHTML = '<a>this is a string</a>';
const sampleError = 'Your account has been temporarily blocked';

describe('error content ui tests', () => {
  test('should render the JsonContent component when error type is json', () => {
    renderWithProviders(<ErrorContent error={sampleJson} />);
    expect(screen.getByText('error', {exact: false})).toBeInTheDocument();
  });
  test('should render the RawHtml component when error type is html', () => {
    renderWithProviders(<ErrorContent error={sampleHTML} />);
    expect(screen.getByText('Html error', {exact: false})).toBeInTheDocument();
  });
  test('should render the error message when error type is general', () => {
    renderWithProviders(<ErrorContent error={sampleError} />);
    expect(screen.getByText('Your account', {exact: false})).toBeInTheDocument();
  });
});

