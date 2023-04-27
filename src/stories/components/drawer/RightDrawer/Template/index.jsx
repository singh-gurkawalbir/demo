import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { Typography } from '@mui/material';
import DrawerHeader from '../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../components/drawer/Right/DrawerContent';
import RightDrawer from '../../../../../components/drawer/Right';
import MockAppBar from '../../../../mocks/AppBar';
import MockPageBar from '../../../../mocks/PageBar';

export default function DrawerTemplate({width, height, variant}) {
  return (
    <>
      <MockAppBar />
      <MockPageBar />
      <MemoryRouter initialEntries={['drawer']}>
        <RightDrawer
          path="drawer"
          width={width}
          height={height}
          variant={variant}
          onClose={action('close-drawer')}
        >

          <DrawerHeader title={`${height} / ${width} / ${variant}`} />

          <DrawerContent>
            <Typography component="p">The drawer variant is `{variant}`.</Typography>
            <Typography component="p">This drawer has its width set to `{width}`.</Typography>
            <Typography component="p">This drawer has its height set to `{height}`.</Typography>
          </DrawerContent>
        </RightDrawer>
      </MemoryRouter>
    </>
  );
}

