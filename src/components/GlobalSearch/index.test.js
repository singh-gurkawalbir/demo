
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import GlobalSearchProto from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('globalSearch UI Tests', () => {
  beforeEach(() => {
    renderWithProviders(<MemoryRouter><GlobalSearchProto /></MemoryRouter>);
  });
  const clickOnSearchIcon = async () => {
    await userEvent.click(screen.getByLabelText(/Global search/i));
  };

  test('should open globalsearch on clicking on search icon', async () => {
    const searchIcon = screen.getByLabelText(/Global search/i);

    await clickOnSearchIcon();
    expect(searchIcon).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();
  });
  test('should close searchbox on clicking on close icon in search input', async () => {
    await clickOnSearchIcon();

    const searchInputCloseButton = screen.getByTitle(/Close Search/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);
    const resourceFiltersButton = screen.getByText('All');

    await userEvent.click(searchInputCloseButton);

    expect(searchInput).not.toBeInTheDocument();

    expect(resourceFiltersButton).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Global search/i)).toBeInTheDocument();
  });
  test('should open globalsearch on pressing / character on keyboard', async () => {
    const searchIcon = screen.getByLabelText(/Global search/i);

    await userEvent.keyboard('/');

    expect(searchIcon).not.toBeInTheDocument();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    const resourceFiltersButton = screen.getByText('All');

    expect(resourceFiltersButton).toBeInTheDocument();
  });
  test('should clear the input on pressing escape character on keyboard when there is text', async () => {
    await userEvent.keyboard('/');

    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('/a');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
    });
  });
  test('should close the global search on pressing escape character on keyboard when there is no text', async () => {
    await userEvent.keyboard('/');

    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('/a');
    await userEvent.keyboard('{Escape}');
    expect(searchInput).toHaveValue('');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByLabelText(/Global search/i)).toBeInTheDocument());
  });
  test('should not open Results Panel typing one character on input', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'a');
    expect(searchInput).toHaveValue('a');
    expect(screen.queryByLabelText(/Global search results/i)).not.toBeInTheDocument();
  });
  test('should open Results Panel on typing two or more characters on input', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
      expect(screen.queryByText(/Resources \(/i)).toBeInTheDocument();
      expect(screen.queryByText(/Marketplace: Apps & templates \(/i)).toBeInTheDocument();
      expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    });
  });
  test('should open Results Panel Typing two or more characters on input and on deleting results panel should be closed', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument());
    await userEvent.type(searchInput, '{backspace}');
    expect(searchInput).toHaveValue('a');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).not.toBeInTheDocument());
  });
  test('should close Results Panel on clicking on close button on results panel and clear the search input and focus the search input', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument());
    const closeResultsPanelButton = screen.queryByLabelText(/Close Resultspanel/);

    await userEvent.click(closeResultsPanelButton);
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('');
  });
  test('should open Marketplace results on clicking on MarketplaceTab  and focus search input', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(/i);

    await userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('am');
    expect(screen.queryByText(/Checkout/)).not.toBeInTheDocument();
  });
  test('should open Resource results on clicking on Resources Tab  and focus search input', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'am');
    expect(searchInput).toHaveValue('am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/Global search results/i)).toBeInTheDocument();
    });
    const marketplaceTab = screen.queryByText(/Marketplace: Apps & templates \(/i);

    await userEvent.click(marketplaceTab);
    expect(screen.queryByText(/Your search didn’t return any matching results. Try expanding your search criteria/i)).toBeInTheDocument();
    const resourcesTab = screen.queryByText(/Resources \(/i);

    await userEvent.click(resourcesTab);
    expect(searchInput).toHaveFocus();
    expect(searchInput).toHaveValue('am');
    expect(screen.queryByText(/Checkout/)).not.toBeInTheDocument();
  });
  test('should open Resourcefilter on typing special charcters with :  with selected filters', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    expect(searchInput).toBeInTheDocument();
    await userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/^Resource Filter/i)).toBeInTheDocument();
    });
    const integrationsItem = screen.queryByLabelText('Integrations');

    expect(integrationsItem).toBeChecked();
    const integrationApps = screen.queryAllByLabelText(/Integration apps/);

    integrationApps?.forEach(item => {
      expect(item).toBeChecked();
    });
    expect(screen.queryByLabelText(/Connections/)).toBeChecked();
  });
  test('should open Resourcefilter with selected filters on typing special charcters with :  and when : is deleted , the resource filters should be closed', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    await userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/^Resource Filter/i)).toBeInTheDocument();
    });
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(screen.queryByLabelText(/^Resource Filter/i)).not.toBeInTheDocument();
    });
  });
  test('should remove the : on clicking on any filter when search input has : and also the string before it, filters should be updated filters', async () => {
    await clickOnSearchIcon();
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    await userEvent.type(searchInput, 'i,c: am');
    await waitFor(() => {
      expect(screen.queryByLabelText(/^Resource Filter/i)).toBeInTheDocument();
    });
    const scriptsItem = screen.queryByLabelText(/scripts/i);

    await userEvent.click(scriptsItem);
    expect(searchInput).toHaveFocus();
    await waitFor(() => expect(searchInput).toHaveValue(' am'), {timeout: 8000});
    expect(screen.queryByLabelText(/Integrations/i)).toBeChecked();
    screen.queryAllByLabelText(/Integration apps/i)?.forEach(item => expect(item).toBeChecked());
    expect(screen.queryByLabelText(/Connections/)).toBeChecked();
    expect(screen.queryByLabelText(/Scripts/i)).toBeChecked();
  });
  test('should open resource filters on clicking on ResourceFilter button', async () => {
    await clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);

    await userEvent.click(resourceFilterButton);
    expect(screen.queryByLabelText(/^Resource Filter/i)).toBeInTheDocument();
  });
  test('should close resource filters on clicking on ResourceFilter button when it is already open', async () => {
    await clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);

    await userEvent.click(resourceFilterButton);

    expect(screen.queryByLabelText(/^Resource Filter/i)).toBeInTheDocument();
    await userEvent.click(resourceFilterButton);
    expect(screen.queryByLabelText(/^Resource Filter/i)).not.toBeInTheDocument();
  });
  test('should close resource filters on clicking on close button on ResourceFilter popup and focus the search input', async () => {
    await clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    await userEvent.click(resourceFilterButton);
    const closeButton = screen.queryByLabelText(/^Close Resource filter/i);

    await userEvent.click(closeButton);
    expect(screen.queryByLabelText(/^Resource Filter/i)).not.toBeInTheDocument();
    expect(searchInput).toHaveFocus();
  });
  test('should enable the filter on clicking on Menu Item in resource filters  and focus the search input and uncheck all filter', async () => {
    await clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    await userEvent.click(resourceFilterButton);
    const allMenuItem = screen.queryByLabelText('All');

    expect(allMenuItem).toBeChecked();

    const connections = screen.queryByLabelText(/Connections/i);
    const scripts = screen.queryByLabelText(/Scripts/i);

    await userEvent.click(connections);
    expect(searchInput).toHaveFocus();
    expect(allMenuItem).not.toBeChecked();
    expect(connections).toBeChecked();
    await userEvent.click(scripts);
    expect(scripts).toBeChecked();
  });
  test('clicking on an already selected Filter Menu Item in resource filters should uncheck and update the filter and focus the search input and if no filters are selected, all should be checked by default', async () => {
    await clickOnSearchIcon();
    const resourceFilterButton = screen.queryByText(/all/i);
    const searchInput = screen.getByLabelText(/Search integrator.io/i);

    await userEvent.click(resourceFilterButton);
    const allMenuItem = screen.queryByLabelText('All');

    expect(allMenuItem).toBeChecked();

    const connections = screen.queryByLabelText(/Connections/i);

    await userEvent.click(connections);
    expect(searchInput).toHaveFocus();
    expect(allMenuItem).not.toBeChecked();
    expect(connections).toBeChecked();
    await userEvent.click(connections);
    expect(allMenuItem).toBeChecked();
    expect(connections).not.toBeChecked();
  });
});
