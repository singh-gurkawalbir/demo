/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import Loader from '.';

describe('Loader UI tests', () => {
  test('should show message when "open" prop is passed to Loader component', async () => {
    renderWithProviders(<Loader hideBackDrop open><div>message</div></Loader>);
    const messsage = screen.getByText('message');

    expect(messsage).toBeVisible();
  });
  test('should not show message when "open" prop is not passed to Loader component', async () => {
    renderWithProviders(<Loader hideBackDrop ><div>message</div></Loader>);
    const messsage = screen.queryByText('message');

    expect(messsage).not.toBeInTheDocument();
  });
});
