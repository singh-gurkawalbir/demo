/* global describe, test, expect */
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CeligoPillTabs from '.';
import {CeligoTabWrapper } from '../CeligoTabWrapper';

const props = {
  defaultTab: 'Preview',
  tabs: [],
};

describe('Testing Celigo Pills Tab', async () => {
  test('Testing Celigo Pills Tab with defaultTab and empty tabs Props', () => {
    render(
      <MemoryRouter>
        <CeligoTabWrapper>
          <CeligoPillTabs {...props} />
        </CeligoTabWrapper>
      </MemoryRouter>
    );
  });

  test('Testing Celigo Pills Tab with defaultTab and one tabs Props', () => {
    render(
      <MemoryRouter>
        <CeligoTabWrapper>
          <CeligoPillTabs defaultTab="Preview" tabs={[{label: 'Parsed output', value: 'preview'}]} />
        </CeligoTabWrapper>
      </MemoryRouter>
    );
    const value1 = screen.getByText('Parsed output');

    expect(value1).toBeInTheDocument();
    const value2 = document.querySelector("[data-test='Parsed output']");

    expect(value2).toBeInTheDocument();
  });
  test('Testing Celigo Pills Tab with defaultTab as null and array of tabs Props', () => {
    render(
      <MemoryRouter>
        <CeligoTabWrapper>
          <CeligoPillTabs defaultTab="" tabs={[{label: 'HTTP request', value: 'request'}, {label: 'HTTP response', value: 'raw'}, {label: 'Parsed output', value: 'preview'}]} />
        </CeligoTabWrapper>
      </MemoryRouter>
    );
    const value1 = screen.getByText('HTTP request');

    expect(value1).toBeInTheDocument();
    const value2 = document.querySelector("[data-test='HTTP request']");

    expect(value2).toBeInTheDocument();
    const value3 = screen.getByText('HTTP response');

    expect(value3).toBeInTheDocument();
    const value4 = document.querySelector("[data-test='HTTP response']");

    expect(value4).toBeInTheDocument();
    const value5 = screen.getByText('Parsed output');

    expect(value5).toBeInTheDocument();
    const value6 = document.querySelector("[data-test='Parsed output']");

    expect(value6).toBeInTheDocument();
  });
});
