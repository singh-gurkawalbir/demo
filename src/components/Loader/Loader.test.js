/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import {renderWithProviders} from '../../test/test-utils';
import Loader from '.';

describe('Loader testing', () => {
  test('should test when message is visible', async () => {
    renderWithProviders(<Loader hideBackDrop open><div>message</div></Loader>);
    const messsage = screen.getByText('message');

    expect(messsage).toBeVisible();
  });
  test('should test when message is not visible', async () => {
    renderWithProviders(<Loader hideBackDrop ><div>message</div></Loader>);
    const messsage = screen.queryByText('message');

    expect(messsage).not.toBeInTheDocument();
  });
});
