
import { render, screen } from '@testing-library/react';
import React from 'react';
import HeaderWithHelpText from '.';

jest.mock('../../../Help', () => ({
  __esModule: true,
  ...jest.requireActual('../../../Help'),
  default: props => (
    <>
      <div>Help Title = {props.title}</div>
      <div>HelpKey = {props.helpKey}</div>
    </>
  ),
}));

describe('testsuite for Header with help text', () => {
  test('should test the Header with help text by passing title and helpKey as props', () => {
    render(
      <HeaderWithHelpText title="Test title" helpKey="Test Help Key" />
    );
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText(/help title = test title/i)).toBeInTheDocument();
    expect(screen.getByText(/helpkey = test help key/i)).toBeInTheDocument();
  });
  test('should test the Header with help text by not passing title and helpKey as props', () => {
    render(
      <HeaderWithHelpText />
    );
    expect(screen.queryByText('Test title')).not.toBeInTheDocument();
  });
});
