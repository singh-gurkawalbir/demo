import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PanelHeader from '.';
import { renderWithProviders } from '../../test/test-utils';

async function initPanelheader({children = '', title = '', infoText = '', placement = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <PanelHeader
        title={title}
        infoText={infoText}
        placement={placement}
      >
        {children}
      </PanelHeader>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('testsuite for Panel Header', () => {
  test('should test the panel header with empty children, title, infoText and placement', async () => {
    const { utils } = await initPanelheader();

    expect(utils.container.firstChild.lastChild).toBeEmptyDOMElement();
  });
  test('should test the panel header when children has a value of type number, title, infoText and placement', async () => {
    await initPanelheader({children: 123, title: 'Testing Title', infoText: 'Testing InfoText', placement: 'right'});
    expect(screen.getByRole('heading', {name: /Testing Title/i})).toBeInTheDocument();
    const buttonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'openPageInfo');

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    expect(screen.getByText(/Testing InfoText/i)).toBeInTheDocument();
    expect(screen.getByText(/123/i)).toBeInTheDocument();
  });
  test('should test the panel header when children has a value of type string, title, infoText and placement', async () => {
    await initPanelheader({children: 'Testing Children', title: 'Testing Title', infoText: 'Testing InfoText', placement: 'right'});
    expect(screen.getByRole('heading', {name: /Testing Title/i})).toBeInTheDocument();
    const buttonNode = screen.getAllByRole('button').find(eachOption => eachOption.getAttribute('data-test') === 'openPageInfo');

    expect(buttonNode).toBeInTheDocument();
    await userEvent.click(buttonNode);
    expect(screen.getByText(/Testing InfoText/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing Children/i)).toBeInTheDocument();
  });
  test('should test the panel header when children has a value of type string, title and placement but no info text', async () => {
    await initPanelheader({children: 'Testing Children', title: 'Testing Title', infoText: '', placement: 'right'});
    expect(screen.getByRole('heading', {name: /Testing Title/i})).toBeInTheDocument();
    expect(screen.getByText(/Testing Children/i)).toBeInTheDocument();
  });
});
