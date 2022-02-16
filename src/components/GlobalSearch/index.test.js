import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GlobalSearchProto from '.';

describe('GlobalSearch UI Tests', () => {
  beforeEach(() => {
    render(<MemoryRouter><GlobalSearchProto /></MemoryRouter>);
  });
  const clickOnSearchIcon = () => {
    userEvent.click(screen.getByLabelText(/Global search/i));
  };

  test('Clicking on search icon should open globalsearch', () => {
    const searchIcon = screen.getByLabelText(/Global search/i);

    clickOnSearchIcon();
    expect(searchIcon).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();
  });
  test('Clicking on close icon in search input should close searchbox', () => {
    clickOnSearchIcon();

    const searchInputCloseButton = screen.getByTitle(/Close Search/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);
    const resourceFiltersButton = screen.getByText('All');

    userEvent.click(searchInputCloseButton);

    expect(searchInput).not.toBeInTheDocument();

    expect(resourceFiltersButton).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Global search/i)).toBeInTheDocument();
  });
  test('Pressing / character on keyboard should open globalsearch', () => {
    const searchIcon = screen.getByLabelText(/Global search/i);

    userEvent.keyboard('/');

    expect(searchIcon).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();
  });
  test('Pressing Escape character on keyboard when there is text should clear the input', () => {
    const searchIcon = screen.getByLabelText(/Global search/i);

    userEvent.keyboard('/');

    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('/a');
    userEvent.keyboard('{esc}');
    expect(searchInput).toHaveValue('');
  });
  test('Pressing Escape character on keyboard when there is no text should close the global search', async () => {
    userEvent.keyboard('/');

    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('/a');
    userEvent.keyboard('{esc}');
    expect(searchInput).toHaveValue('');
    userEvent.keyboard('{esc}');
    await waitFor(() => expect(screen.getByLabelText(/Global search/i)).toBeInTheDocument());
  });
  test('Typing one character on input should not open Results Panel', () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('a');
    expect(screen.queryByLabelText(/Global search results/i)).not.toBeInTheDocument();
  });
  test('Typing two or more characters on input should open Results Panel', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
      expect(screen.queryByText(/Resources \(/i)).toBeInTheDocument();
      expect(screen.queryByText(/Marketplace: Apps & templates \(/i)).toBeInTheDocument();
      expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    });
  });
  test('Typing two or more characters on input should open Results Panel and on deleting results panel should be closed', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument());
    userEvent.type(searchInput, '{backspace}');
    expect(searchInput).toHaveValue('a');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).not.toBeInTheDocument());
  });
  test('Clicking on close button on results panel should close Results Panel and clear the search input and focus the search input', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument());
    const closeResultsPanelButton = screen.queryByLabelText(/Close Resultspanel/);

    userEvent.click(closeResultsPanelButton);
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('');
  });
  test('Clicking on MarketplaceTab should open Marketplace results and focus search input', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(/i);

    userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('am');
    expect(screen.queryByText(/Checkout/)).not.toBeInTheDocument();
  });
  test('Clicking on Resources Tab should open Resource results and focus search input', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(/i);

    userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    const resourcesTab = screen.queryByText(/Resources \(/i);

    userEvent.click(resourcesTab);
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('am');
    expect(screen.queryByText(/Checkout/)).not.toBeInTheDocument();
  });
  test('Typing special charcters with : should open Resourcefilter with selected filters', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Resource Filter/i)).toBeInTheDocument();
    });
    const integrationsItem = screen.queryByLabelText('Integrations');

    expect(integrationsItem).toBeChecked();
    const integrationApps = screen.queryAllByLabelText(/Integration apps/);

    integrationApps?.forEach(item => {
      expect(item).toBeChecked();
    });
    expect(screen.queryByLabelText(/Connections/)).toBeChecked();
  });
  test('Typing special charcters with : should open Resourcefilter with selected filters and when : is deleted , the resource filters should be closed', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Resource Filter/i)).toBeInTheDocument();
    });
    userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.queryByLabelText(/Resource Filter/i)).not.toBeInTheDocument();
    });
  });
  test('Clicking on any filter when search input has : should remove the : and also the string before it, filters should be updated filters', async () => {
    clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Resource Filter/i)).toBeInTheDocument();
    });
    const scriptsItem = screen.queryByLabelText(/scripts/i);

    userEvent.click(scriptsItem);
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('am');
    expect(screen.queryByLabelText(/Integrations/i)).toBeChecked();
    screen.queryAllByLabelText(/Integration apps/i)?.forEach(item => expect(item).toBeChecked());
    expect(screen.queryByLabelText(/Connections/)).toBeChecked();
    expect(screen.queryByLabelText(/Scripts/i)).toBeChecked();
  });
  test('Clicking on ResourceFilter button should open resource filters', () => {
    clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);

    userEvent.click(resourceFilterButton);
    expect(screen.queryByLabelText(/Resource Filter/i)).toBeInTheDocument();
  });
  test('Clicking on ResourceFilter button when it is already open should close resource filters', () => {
    clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);

    userEvent.click(resourceFilterButton);
    expect(screen.queryByLabelText(/Resource Filter/i)).toBeInTheDocument();
    userEvent.click(resourceFilterButton);
    expect(screen.queryByLabelText(/Resource Filter/i)).not.toBeInTheDocument();
  });
  test('Clicking on close button on ResourceFilter popup should close resource filters and focus the search input', () => {
    clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.click(resourceFilterButton);
    const closeButton = screen.queryByLabelText(/Close Resource filter/i);

    userEvent.click(closeButton);
    expect(screen.queryByLabelText(/Resource Filter/i)).not.toBeInTheDocument();
    expect(searchInput).toHaveFocus();
  });
  test('Clicking on Menu Item in resource filters should enable the filter and focus the search input and uncheck all filter', () => {
    clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.click(resourceFilterButton);
    const allMenuItem = screen.queryByLabelText('All');

    expect(allMenuItem).toBeChecked();

    const connections = screen.queryByLabelText(/Connections/i);
    const scripts = screen.queryByLabelText(/Scripts/i);

    userEvent.click(connections);
    expect(searchInput).toHaveFocus();
    expect(allMenuItem).not.toBeChecked();
    expect(connections).toBeChecked();
    userEvent.click(scripts);
    expect(scripts).toBeChecked();
  });
  test('Clicking on an already selected Filter Menu Item in resource filters should uncheck and update the filter and focus the search input and if no filters are selected, all should be checked by default', () => {
    clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    userEvent.click(resourceFilterButton);
    const allMenuItem = screen.queryByLabelText('All');

    expect(allMenuItem).toBeChecked();

    const connections = screen.queryByLabelText(/Connections/i);

    userEvent.click(connections);
    expect(searchInput).toHaveFocus();
    expect(allMenuItem).not.toBeChecked();
    expect(connections).toBeChecked();
    userEvent.click(connections);
    expect(allMenuItem).toBeChecked();
    expect(connections).not.toBeChecked();
  });
});
