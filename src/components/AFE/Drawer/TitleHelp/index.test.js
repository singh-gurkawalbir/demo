/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import TitleHelp from '.';

let initialStore;

async function initTitleHelp(editorId, label) {
  const mustateState = draft => {
    draft.session.editors = {
      '231c3': {
        editorType: 'mappings',
        resourceType: 'mappings',
      },
    };
  };

  mutateStore(initialStore, mustateState);
  const ui = (
    <MemoryRouter>
      <TitleHelp editorId={editorId} label={label} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for RouterGuide', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });

  test('Should render TitleHelp button', async () => {
    await initTitleHelp('231c3', 'Field help');
    expect(screen.getByRole('button')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
  });
});
