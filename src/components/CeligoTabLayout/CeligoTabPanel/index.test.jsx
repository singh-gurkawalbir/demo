/* global describe, test, expect */
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CeligoTabPanel from '.';
import {CeligoTabWrapper} from '../CeligoTabWrapper';
import CeligoPillTabs from '../CeligoPillTabs';

const props = {
  children: 'Testing Children',
  panelId: 'request',
};

describe('Testing Celigo Tab Panel Component', async () => {
  test('Testing Celigo Tab Panel Component when both the activeTab and panelId is not equal', async () => {
    render(
      <MemoryRouter>
        <CeligoTabWrapper>
          <CeligoPillTabs defaultTab="sometext" />
          <CeligoTabPanel {...props} />
        </CeligoTabWrapper>
      </MemoryRouter>
    );
  });
  test('Testing Celigo Tab Panel Component when bith the active tab and panelId is same', async () => {
    render(
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
