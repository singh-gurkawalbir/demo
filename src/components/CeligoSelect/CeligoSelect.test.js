/* global describe, test, expect */
import React, { useState } from 'react';
import { screen } from '@testing-library/react';
import { MenuItem } from '@material-ui/core';
import userEvent from '@testing-library/user-event';
import CeligoSelect from '.';
import { renderWithProviders } from '../../test/test-utils';

export default function SingleSelect() {
  const [country, setCountry] = useState('brazil');

  return (
    <div>
      <CeligoSelect
        data-testid="country"
        labelId="country"
        onChange={({ target: { value } }) => {
          setCountry(value);
        }}
        value={country}
      >
        <MenuItem value="brazil">Brazil</MenuItem>
        <MenuItem value="japan">Japan</MenuItem>
        <MenuItem value="usa">United States</MenuItem>
      </CeligoSelect>
    </div>
  );
}

export function MultipleSelect() {
  const [country, setCountry] = useState(['brazil']);

  return (
    <div>
      <CeligoSelect
        data-testid="country"
        labelId="country"
        onChange={e => setCountry(o => [...o, ...e.target.value])}
        value={country}
        multiple
      >
        <MenuItem value="brazil">Brazil</MenuItem>
        <MenuItem value="japan">Japan</MenuItem>
        <MenuItem value="usa">United States</MenuItem>
      </CeligoSelect>
    </div>
  );
}

describe('CeligoSelect UI Test', () => {
  test('should test for single select option', async () => {
    renderWithProviders(<SingleSelect />);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const japan = screen.getByText('Japan');
    const unitedstates = screen.getByText('United States');

    userEvent.click(japan);
    expect(button.textContent).toBe('Japan');
    const brazil = screen.getByText('Brazil');

    expect(brazil).not.toBeVisible();
    expect(unitedstates).not.toBeVisible();
    expect(japan).not.toBeVisible();
  });

  test('should test for multiple select option', async () => {
    renderWithProviders(<MultipleSelect />);

    const button = screen.getByRole('button');

    userEvent.click(button);
    const unitedstates = screen.getByText('United States');

    userEvent.click(unitedstates);
    const donebutton = screen.getByText('Done');

    userEvent.click(donebutton);
    expect(button.textContent).toBe('Brazil, United States');

    const japan = screen.getByText('Japan');
    const brazil = screen.getByText('Brazil');

    expect(brazil).not.toBeVisible();
    expect(unitedstates).not.toBeVisible();
    expect(japan).not.toBeVisible();
  });
});
