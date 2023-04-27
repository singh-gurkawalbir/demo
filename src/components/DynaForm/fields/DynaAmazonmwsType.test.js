
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaAmazonmwsType from './DynaAmazonmwsType';

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

describe('dynaAmazonmwsType tests', () => {
  test('should able to test DynaAmazonmwsType with already created resource', async () => {
    const props = {resourceId: '_resourceId'};

    await renderWithProviders(<DynaAmazonmwsType {...props} />);
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.getByRole('presentation')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Hybrid Selling Partner API (SP-API and MWS)'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Marketplace Web Service API (MWS)'})).toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Selling Partner API (SP-API)'})).toBeInTheDocument();
  });
  test('should able to test DynaAmazonmwsType with new resource', async () => {
    const props = {resourceId: 'new_resourceId'};

    await renderWithProviders(<DynaAmazonmwsType {...props} />);
    await userEvent.click(screen.getByRole('button', {name: 'Please select'}));
    expect(screen.queryByRole('menuitem', {name: 'Marketplace Web Service API (MWS)'})).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', {name: 'Selling Partner API (SP-API)'})).toBeInTheDocument();
  });
});

