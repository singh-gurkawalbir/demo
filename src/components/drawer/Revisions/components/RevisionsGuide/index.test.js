/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test/test-utils';
import RevisionsGuide from '.';

function SetWidth({width}) {
  // width based on material-ui theme. eg. theme.breakpoints.up('md') = @media (min-width: 960px)
  window.matchMedia = jest.fn().mockImplementation(
    query => ({
      matches: width >= 960,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })
  );

  return <></>;
}
describe('RevisionsGuide tests', () => {
  test('Should able to test the Revisions Guide Link is there when screen sizes are different', async () => {
    const {utils} = await renderWithProviders(<><SetWidth width={1280} /><RevisionsGuide /></>);

    expect(screen.getByRole('link', {name: 'Revisions guide'})).toBeInTheDocument();
    utils.rerender(<><SetWidth width={680} /><RevisionsGuide /></>);
    expect(screen.getByRole('link', {name: 'revisions guide'})).toBeInTheDocument();
  });
});
