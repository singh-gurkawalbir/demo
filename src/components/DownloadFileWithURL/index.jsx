import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../reducers';

const useStyles = makeStyles(() => ({
  anchor: {
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
    },
  },
}));

export default function DownloadFileWithURL({ downloadUrl, children }) {
  const classes = useStyles();
  let url = downloadUrl;
  const additionalHeaders = useSelector(
    state => selectors.accountShareHeader(state, url),
    shallowEqual
  );

  if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
    url += `?integrator-ashareid=${additionalHeaders['integrator-ashareid']}`;
  }

  return (
    <a
      href={url}
      download
      className={classes.anchor}
      data-testid="downloadLink"
    >
      {children}
    </a>
  );
}
