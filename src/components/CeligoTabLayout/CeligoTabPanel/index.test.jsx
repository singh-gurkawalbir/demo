import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CeligoTabPanel from '.';
import {CeligoTabWrapper} from '../CeligoTabWrapper';
import CeligoPillTabs from '../CeligoPillTabs';
import { renderWithProviders } from '../../../test/test-utils';

const props = {
  children: 'Testing Children',
  panelId: 'request',
};

describe('testing Celigo Tab Panel Component', () => {
  test('testing Celigo Tab Panel Component when bith the active tab and panelId is same', async () => {
    renderWithProviders(
      <MemoryRouter>
        <CeligoTabWrapper>
          <CeligoPillTabs defaultTab="Okay" />
          <CeligoTabPanel {...{...props, panelId: 'Okay'}} >{props.children}</CeligoTabPanel>
        </CeligoTabWrapper>
      </MemoryRouter>
    );
    const value1 = screen.getByText('Testing Children');

    expect(value1).toBeInTheDocument();
  });
});
