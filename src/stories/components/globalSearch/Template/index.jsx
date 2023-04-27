import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
// eslint-disable-next-line import/no-extraneous-dependencies
import GlobalSearchProto from '../../../../components/GlobalSearch/index';

const useStyles = makeStyles(() => ({
  templateRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

export default function Template(props) {
  const classes = useStyles();

  return (
    <div className={classes.templateRoot}>
      <GlobalSearchProto
        {...props} />
    </div>
  );
}
