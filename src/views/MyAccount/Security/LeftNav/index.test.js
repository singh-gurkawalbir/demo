
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import LeftNav from '.';
import { renderWithProviders } from '../../../../test/test-utils';

async function initLeftNav({mode, params} = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/myAccount/${params.tab}/${mode}`}]}
    >
      <Route
        path="/myAccount/security"
        params={params}
      >
        <LeftNav />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('Testsuite for Left Nav', () => {
  test('should be able to click the links and check the activity status in class name', async () => {
    await initLeftNav({mode: 'sso', params: {tab: 'security'}});
    const singleSignOnLinkNode = screen.getByRole('link', { name: /single sign-on \(sso\)/i });

    expect(singleSignOnLinkNode).toBeInTheDocument();
    await userEvent.click(singleSignOnLinkNode);
    expect(document.querySelector('div > ul > li > div').className).toEqual(expect.stringContaining('makeStyles-active-'));
    expect(document.querySelector('div > ul > li:nth-child(2) > div').className).not.toEqual(expect.stringContaining('makeStyles-active-'));

    const multifactorAuthenticationLinkNode = screen.getByRole('link', {name: /multifactor authentication \(mfa\)/i});

    expect(multifactorAuthenticationLinkNode).toBeInTheDocument();
    await userEvent.click(multifactorAuthenticationLinkNode);
    expect(document.querySelector('div > ul > li:nth-child(2) > div').className).toEqual(expect.stringContaining('makeStyles-active-'));
    expect(document.querySelector('div > ul > li:nth-child(1) > div').className).not.toEqual(expect.stringContaining('makeStyles-active-'));
  });
});

