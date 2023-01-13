
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import DynaRoutingRules from './DynaRoutingRules';
import { renderWithProviders } from '../../../test/test-utils';

jest.mock('./DynaHook_afe', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaHook_afe'),
  default: () => <div>Mock DynaHook_afe</div>}
));

function initDynaRoutingRules(props = {}) {
  const ui = (
    <MemoryRouter>
      <DynaRoutingRules
        {...props}
    />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('dynaRoutingRules UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test dynarouting rules', () => {
    const genralProps = {
      id: '5cd51efd3607fe7d8eda9c97',
      label: 'Routing rules editor',
      title: 'Choose a script and function name to use for determining AS2 message routing',
    };

    initDynaRoutingRules(genralProps);
    const launchButton = screen.getByText('Launch');

    userEvent.click(launchButton);
    const mockdynahook = screen.getByText('Mock DynaHook_afe');

    expect(mockdynahook).toBeInTheDocument();
    const SaveButton = screen.getByText('Save');

    userEvent.click(SaveButton);

    expect(mockdynahook).not.toBeInTheDocument();

    userEvent.click(launchButton);
    const mockdynahookcancel = screen.getByText('Mock DynaHook_afe');

    expect(mockdynahookcancel).toBeInTheDocument();
    const cancelButton = screen.getByText('Cancel');

    userEvent.click(cancelButton);
    expect(mockdynahookcancel).not.toBeInTheDocument();
    userEvent.click(launchButton);
    expect(screen.getByText('Mock DynaHook_afe')).toBeInTheDocument();
    userEvent.click(screen.getByTestId('closeModalDialog'));
    expect(cancelButton).not.toBeInTheDocument();
  });
});
