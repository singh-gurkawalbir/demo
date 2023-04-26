
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CeligoTable from '../../../../../CeligoTable';
import metadata from '../../metadata';
import { renderWithProviders } from '../../../../../../test/test-utils';

jest.mock('../../../../../RunFlowButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../RunFlowButton'),
  default: props => {
    const str = `flowId: ${props.flowId} ${props.runOnMount}`;

    return (
      <div>{str}</div>
    );
  },
}));

async function renderFunction() {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        {...metadata}
        data={[{_flowId: 'someId', _id: '_id'}]}
      />
    </MemoryRouter>
  );
  await userEvent.click(screen.getByRole('button', {name: /more/i}));
}

describe('run flow action test cases', () => {
  test('should click on RunFlow button', async () => {
    await renderFunction();
    await userEvent.click(screen.getByText('Run flow'));
    expect(screen.getByText('flowId: someId true')).toBeInTheDocument();
  });
});
