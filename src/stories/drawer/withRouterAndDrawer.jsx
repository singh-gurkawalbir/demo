import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import RightDrawer from '../../components/drawer/Right';

export default function withRouterAndDrawer(Story, context) {
  const history =
      context.name === 'No Frills'
        ? ['drawer']
        : ['drawer', 'drawer/subpage'];

  // console.log(context);
  return (
    <MemoryRouter initialEntries={history} initialIndex={1}>
      <RightDrawer path="drawer" height="tall" onClose={action('close-drawer')}>
        <Story {...context} />
      </RightDrawer>
    </MemoryRouter>
  );
}
