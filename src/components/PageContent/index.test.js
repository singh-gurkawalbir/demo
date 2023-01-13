import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PageContent from '.';
import { renderWithProviders } from '../../test/test-utils';

async function initPageContent({children = '', showPagingBar, hidePagingBar} = {}) {
  const ui = (
    <MemoryRouter>
      <PageContent
        showPagingBar={showPagingBar}
        hidePagingBar={hidePagingBar}
        >
        {children}
      </PageContent>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}
describe('testsuite for Page Content', () => {
  test('should able to render empty children for page content', async () => {
    const { utils } = await initPageContent();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
  test('should able to render children which has value of type number for page content', async () => {
    const { utils } = await initPageContent({children: 123, showPagingBar: true, hidePagingBar: true});

    expect(screen.getByText(/123/i)).toBeInTheDocument();
    expect(utils.container.firstChild.className).toEqual(expect.stringContaining('makeStyles-pagingBarShow-'));
  });
  test('should able to render children which has value of type string for page content and showPagingBar as false', async () => {
    const { utils } = await initPageContent({children: 'test', showPagingBar: false, hidePagingBar: true});

    expect(screen.getByText(/test/i)).toBeInTheDocument();
    expect(utils.container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-pagingBarShow-'));
    expect(utils.container.firstChild.className).toEqual(expect.stringContaining('makeStyles-pagingBarHide-'));
  });
  test('should able to render children which has value null for page content and pagingBarHide as false', async () => {
    const { utils } = await initPageContent({children: null, showPagingBar: true, hidePagingBar: false});

    expect(utils.container.firstChild.className).not.toEqual(expect.stringContaining('makeStyles-pagingBarHide-'));
    expect(utils.container.firstChild.className).toEqual(expect.stringContaining('makeStyles-pagingBarShow-'));
  });
});
