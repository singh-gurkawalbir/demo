import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionIconButton from './index';
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

    expect(buttonNode.getAttribute('title')).toBe('Test help Text');
    userEvent.hover(buttonNode);
    expect(buttonNode).not.toHaveAttribute('title');
    await waitFor(() => expect(buttonNode).toHaveAttribute('aria-describedBy'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test help Text');
    userEvent.unhover(buttonNode);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    await waitFor(() => expect(buttonNode).toHaveAttribute('title'));
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

    expect(buttonNode.getAttribute('title')).toBe('Test help key');
    userEvent.hover(buttonNode);
    expect(buttonNode).not.toHaveAttribute('title');
    await waitFor(() => expect(buttonNode).toHaveAttribute('aria-describedBy'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Test help key');
    userEvent.unhover(buttonNode);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    await waitFor(() => expect(buttonNode).toHaveAttribute('title'));
    expect(screen.getByText(/test children/i)).toBeInTheDocument();
  });
});
