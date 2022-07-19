/* eslint-disable quotes */
/* global describe, test, expect, jest */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';
import DefaultPanel from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const props = { value: {test: 'value1', test1: 'value2'}, isLoggable: true };

describe('Testing Default panel Component', async () => {
  test('Testing Default panel by passing a value to the value key', async () => {
    renderWithProviders(
      <DefaultPanel {...props} />
    );
    const value1 = screen.getByText('Copy');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);
    const value2 = screen.getByText('Copied to clipboard');

    expect(value2).toBeInTheDocument();
  });

  test('Testing Default panel by passing a null value to the value key', async () => {
    const {utils} = renderWithProviders(
      <DefaultPanel {...{...props, value: ''}} />
    );

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('Testing Default panel by passing a value to the value key and by passing xml as a value to the content type', async () => {
    renderWithProviders(
      <DefaultPanel {...{...props, contentType: 'XML'}} />
    );
    const value1 = screen.getByText('Copy');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);
    const value2 = screen.getByText('Copied to clipboard');

    expect(value2).toBeInTheDocument();
  });
  test('Testing Default panel by passing a JSON data to the value key in props', async () => {
    JSON.parse = jest.fn().mockImplementationOnce(() => {
      // return your what your code is returning.
    });
    renderWithProviders(
      <DefaultPanel
        {...{...props,
          value: {
            // eslint-disable-next-line quote-props
            "test1": "value1",
            // eslint-disable-next-line quote-props
            "test2": "value2",
          }}} />
    );
    const value1 = screen.getByText('Copy');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);
    const value2 = screen.getByText('Copied to clipboard');

    expect(value2).toBeInTheDocument();
  });
});
