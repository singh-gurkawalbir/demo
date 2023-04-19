import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionIconButton from '.';
import { FlowProvider } from '../FlowBuilderBody/Context';
import { renderWithProviders } from '../../../test/test-utils';

function initActionIconButton({
  helpKey,
  helpText,
  children,
  className,
  variant,
  ...props
}) {
  const ui = (
    <FlowProvider flowId="id">
      <ActionIconButton
        helpKey={helpKey}
        helpText={helpText}
        className={className}
        variant={variant}
        props={props}
    >
        {children}
      </ActionIconButton>
    </FlowProvider>
  );

  return renderWithProviders(ui);
}
jest.mock('../../../components/Help', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/Help'),
  getHelpTextMap: jest.fn().mockReturnValue({x: 'Test help key'}),
}));
describe('Testsuite for Action Icon Button', () => {
  test('should test the action icon button and children and help text by hovering and unhovering on the icon', async () => {
    initActionIconButton({
      helpKey: 'Test Help Key',
      helpText: 'Test help Text',
      children: 'Test Children',
      className: 'Test Class',
      variant: 'Test Variant',
      props: {test: 'testing props'},
    });
    const buttonNode = screen.getByRole('button');

    await userEvent.hover(buttonNode);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Test help Text'));

    await userEvent.unhover(buttonNode);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
  });
  test('should test the action icon button and children and help key by hovering and unhovering on the icon', async () => {
    initActionIconButton({
      helpKey: 'x',
      children: 'Test Children',
      className: 'Test Class',
      variant: 'Test Variant',
      props: {test: 'testing props'},
    });
    const buttonNode = screen.getByRole('button');

    await userEvent.hover(buttonNode);
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Test help key'));

    await userEvent.unhover(buttonNode);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
  });
});
