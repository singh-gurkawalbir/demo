import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../../test/test-utils';
import TabbedPanelGridItem from '.';
import IsLoggableContextProvider from '../../../../IsLoggableContextProvider';

describe('tabbedPanelGridItem UI tests', () => {
  const panelGroup = {panels: [{key: 'key1', Panel: 'panel1', name: 'tab1', props: {}}, {key: 'key2', Panel: 'panel1', name: 'tab2', props: {}}, {key: 'key3', Panel: 'panel1', name: 'tab3', props: {}}]};

  test('should pass the initial render', () => {
    const props = {
      editorId: 'filecsv',
      panelGroup,
    };

    renderWithProviders(<IsLoggableContextProvider><TabbedPanelGridItem {...props} /></IsLoggableContextProvider>);
    expect(screen.getByText('tab1')).toBeInTheDocument();
    expect(screen.getByText('tab2')).toBeInTheDocument();
    expect(screen.getByText('tab3')).toBeInTheDocument();
    const selectedTab = screen.getByRole('tabpanel');

    expect(selectedTab).toBeInTheDocument();

    expect(selectedTab).toHaveAttribute('id', 'tabpanel-key1');
  });
  test('should display the clicked tab when selected tab is changed', async () => {
    const props = {
      editorId: 'filecsv',
      panelGroup,
    };

    renderWithProviders(<IsLoggableContextProvider><TabbedPanelGridItem {...props} /></IsLoggableContextProvider>);
    const selectedTab = screen.getByRole('tabpanel');

    expect(selectedTab).toBeInTheDocument();
    expect(selectedTab).toHaveAttribute('id', 'tabpanel-key1');
    expect(screen.getByText('tab2')).toBeInTheDocument();
    await userEvent.click(screen.getByText('tab2'));
    expect(selectedTab).toHaveAttribute('id', 'tabpanel-key2');      // change in id indicates the render of different tab //
  });
});
