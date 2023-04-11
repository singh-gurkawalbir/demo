
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MultipleAction from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function initMultipleAction({ rowData, handleMenuClose, setSelectedComponent, meta = {} } = {}) {
  const ui = (
    <MemoryRouter>
      <MultipleAction
        rowData={rowData}
        handleMenuClose={handleMenuClose}
        setSelectedComponent={setSelectedComponent}
        meta={meta}
        />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('multipleAction component Test cases', () => {
  runServer();
  test('should pass the intial render with default value', async () => {
    const { utils } = await initMultipleAction();

    expect(utils.container).not.toBeEmptyDOMElement();
  });

  test('should pass the intial render with useDisabledActionText', async () => {
    const useDisabledActionText = jest.fn(() => 'use_disabled_action_text');

    await initMultipleAction({
      meta: {
        useDisabledActionText,
      },
    });

    expect(screen.getByLabelText('use_disabled_action_text')).toBeInTheDocument();
  });

  test('should pass the intial render with useHasAccess false', async () => {
    const useHasAccess = jest.fn(() => false);

    const { utils } = await initMultipleAction({
      meta: {
        useHasAccess,
      },
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
