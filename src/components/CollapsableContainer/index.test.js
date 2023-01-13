
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CollapsableContainer from '.';
import {renderWithProviders} from '../../test/test-utils';

let initialStore;

async function initCollapsableContainer({props} = {}) {
  const ui = (
    <MemoryRouter>
      <CollapsableContainer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('testsuite for CollapsableContainer', () => {
  test('should click on the button and check if expanded', async () => {
    const props = { props: {
      title: 'test',
      children: 'test children',
      className: 'test class',
    },
    };

    await initCollapsableContainer(props);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test children')).toBeInTheDocument();
    const titleButtonNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(titleButtonNode).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'test', expanded: false})).toBeInTheDocument();
    await userEvent.click(titleButtonNode);
    expect(screen.getByRole('button', {name: 'test', expanded: true})).toBeInTheDocument();
  });
  test('should click on the button and check if not expanded', async () => {
    const props = { props: {
      title: 'test',
      forceExpand: true,
      children: 'test children',
      className: 'test class',
    },
    };

    await initCollapsableContainer(props);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('test children')).toBeInTheDocument();
    const titleButtonNode = document.querySelector('svg[viewBox="0 0 24 24"]');

    expect(titleButtonNode).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'test', expanded: true})).toBeInTheDocument();
    await userEvent.click(titleButtonNode);
    expect(screen.getByRole('button', {name: 'test', expanded: false})).toBeInTheDocument();
  });
  test('should test the collapsable container when there is no children', async () => {
    const props = { props: {
      title: 'test',
      className: 'test class',
    },
    };

    const { utils } = await initCollapsableContainer(props);

    expect(utils.container).toBeEmptyDOMElement();
  });
});

