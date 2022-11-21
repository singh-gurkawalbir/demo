/* global describe, test, expect */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import DrawerHeaderSubTitle from '.';

const MockComponent = () => (<p>Text</p>);

describe('DrawerHeaderSubTitle tests', () => {
  test('Should able to test the DrawerHeader Subtitle', async () => {
    await renderWithProviders(<><DrawerHeaderSubTitle><MockComponent /> </DrawerHeaderSubTitle> </>);
    expect(screen.getByText(/Text/i)).toBeInTheDocument();
  });
});
