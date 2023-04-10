import { screen } from '@testing-library/react';
import React from 'react';
import ConnectLineListItem from './ConnectLineListItem';
import { renderWithProviders } from '../../../../test/test-utils';

describe('Testsuite for ConnectLineListItem', () => {
  test('should test the connect line list item when isLastItem is set to true', () => {
    renderWithProviders(
      <ConnectLineListItem index="0" isLastItem />
    );
    expect(screen.getByRole('listitem').className).toEqual(expect.stringContaining('makeStyles-lastSeperator-'));
  });
  test('should test the connect line list item when isLastItem is set to false', () => {
    renderWithProviders(
      <ConnectLineListItem index="0" isLastItem={false} />
    );
    expect(screen.getByRole('listitem').className).not.toEqual(expect.stringContaining('makeStyles-lastSeperator-'));
  });
  test('should test the connect line list item when isLastItem is undefined', () => {
    renderWithProviders(
      <ConnectLineListItem index="0" isLastItem={undefined} />
    );
    expect(screen.getByRole('listitem').className).not.toEqual(expect.stringContaining('makeStyles-lastSeperator-'));
  });
});
