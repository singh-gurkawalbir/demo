/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MaskToken from '.';
import { renderWithProviders} from '../../test/test-utils';

async function initMaskToken({count = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <MaskToken count={count} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('Testsuite for MaskToken', () => {
  test('should able to test the mask token when count is empty', async () => {
    const {utils} = await initMaskToken();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
  test('should able to test the mask token when count has value 1 of type number', async () => {
    const {utils} = await initMaskToken({count: 1});

    expect(utils.container.firstChild).toBeInTheDocument();
    expect(utils.container.firstChild.firstChild.className).toEqual(expect.stringContaining('makeStyles-tokenItem-'));
  });
  test('should able to test the mask token when count has value 1 of type string', async () => {
    const {utils} = await initMaskToken({count: '1'});

    expect(utils.container.firstChild).toBeInTheDocument();
    expect(utils.container.firstChild.firstChild.className).toEqual(expect.stringContaining('makeStyles-tokenItem-'));
  });
});
