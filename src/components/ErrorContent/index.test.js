/* global describe, test, expect, jest, */
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {renderWithProviders} from '../../test/test-utils';
import ErrorContent from '.';

const sampleJson = '{"name":"John", "age":30, "city":"New York"}';
const sampleHTML = '<a>this is a string</a>';
const sampleError = 'Your account has been temporarily blocked';

jest.mock('../JsonContent', () => () => {
  const MockJson = () => <div>Json error displayed</div>;

  return <MockJson />;
});
jest.mock('../RawHtml', () => () => {
  const MockHtml = () => <div>Html error displayed</div>;

  return <MockHtml />;
});
describe('error content ui tests', () => {
  test('testing the render of json error', () => {
    renderWithProviders(<MemoryRouter><ErrorContent error={sampleJson} /></MemoryRouter>);
    expect(screen.getByText('error', {exact: false})).toBeInTheDocument();
  });
  test('testing the render of HTML error', () => {
    renderWithProviders(<MemoryRouter><ErrorContent error={sampleHTML} /></MemoryRouter>);
    expect(screen.getByText('Html error', {exact: false})).toBeInTheDocument();
  });
  test('testing the render of other error', () => {
    renderWithProviders(<MemoryRouter><ErrorContent error={sampleError} /></MemoryRouter>);
    expect(screen.getByText('Your account', {exact: false})).toBeInTheDocument();
  });
});
