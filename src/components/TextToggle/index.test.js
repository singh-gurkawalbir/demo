
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextToggle from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initTextToggle({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <TextToggle {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('TextToggle test cases', () => {
  runServer();

  test('should pass the initial render with default value/ no props', async () => {
    const { utils } = await initTextToggle();

    expect(utils.container.lastChild).toBeEmptyDOMElement();
  });

  test('should pass the initial render with custom props', async () => {
    const onChange = jest.fn();

    await initTextToggle({
      props: {
        onChange,
        value: 'value_2',
        exclusive: true,
        disabled: false,
        options: [{
          dataTest: 'data_test_1',
          label: 'label 1',
          value: 'value_1',
        }, {
          label: 'label 2',
          value: 'value_2',
        }],
      },
    });
    const label1 = screen.getByRole('button', {name: 'label 1'});
    const label2 = screen.getByRole('button', {name: 'label 2'});

    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();

    await userEvent.click(label2);
    expect(onChange).toBeCalledTimes(0); // since it's already selected will not run

    // we need to rerender the component with props value as value_1 to show proper UI
    await userEvent.click(label1);
    expect(onChange).toBeCalledTimes(1);
  });

  test('should pass the initial render with custom props without onchange', async () => {
    await initTextToggle({
      props: {
        value: 'value_2',
        exclusive: true,
        disabled: false,
        options: [{
          dataTest: 'data_test_1',
          label: 'label 1',
          value: 'value_1',
        }, {
          label: 'label 2',
          value: 'value_2',
        }],
      },
    });
    const label1 = screen.getByRole('button', {name: 'label 1'});
    const label2 = screen.getByRole('button', {name: 'label 2'});

    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();

    await userEvent.click(label2);

    await userEvent.click(label1);
  });
});
