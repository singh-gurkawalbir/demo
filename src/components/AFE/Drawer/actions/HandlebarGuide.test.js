
import React from 'react';
import { screen } from '@testing-library/react';
import { AppShell } from '@celigo/fuse-ui';
import HandlebarGuide from './HandlebarGuide';
import { renderWithProviders } from '../../../../test/test-utils';

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

  return null;
}
describe('HandlebarGuide tests', () => {
  test('Should able to test the Handlebar Guide Link is there when screen sizes are different', async () => {
    const {utils} = await renderWithProviders(<><SetWidth width={1280} /><HandlebarGuide /></>);

    expect(screen.getByRole('link', {name: 'Handlebars guide'})).toBeInTheDocument();
    utils.rerender(<AppShell><SetWidth width={680} /><HandlebarGuide /></AppShell>);
    expect(screen.getByRole('link', {name: 'handlebars guide'})).toBeInTheDocument();
  });
});
