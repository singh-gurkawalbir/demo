
import { screen } from '@testing-library/react';
import React from 'react';
import EmptyNode from '.';
import { renderWithProviders } from '../../../../../test/test-utils';

jest.mock('../Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('../Handles/DefaultHandle'),
  default: props => (
    <div>
      <div>Mock DefaultHandle</div>
      <div>{props.type}</div>
      <div>{props.position}</div>
    </div>
  ),
}));
describe('Testsuite for Empty Node', () => {
  test('should test the branch name and info text props', () => {
    renderWithProviders(
      <EmptyNode data={{infoText: 'test infotext', name: 'Testing Branch name'}} />
    );
    expect(screen.getByText(/testing branch name/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /test infotext/i,
    })).toBeInTheDocument();
  });
  test('should test the dom when there is no branch name and info text props passed', () => {
    renderWithProviders(
      <EmptyNode data={{infoText: '', name: ''}} />
    );
    expect(screen.queryByText(/testing branch name/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', {
      name: /test infotext/i,
    })).not.toBeInTheDocument();
  });
});
