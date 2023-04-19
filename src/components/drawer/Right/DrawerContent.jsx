import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@celigo/fuse-ui';

const useStyles = makeStyles(theme => ({
  drawerContent: {
    flex: 1,
    overflow: 'auto',
  },
  withPadding: {
    padding: theme.spacing(3, 3, 0),
  },
}));

export default function DrawerContent({ children, noPadding, className, sxCss }) {
  const classes = useStyles();

  return (
    <Box
      sx={[...(Array.isArray(sxCss) ? sxCss : [sxCss])]}
      className={clsx(classes.drawerContent, { [classes.withPadding]: !noPadding }, className)}>
      {children}
    </Box>
  );
}
