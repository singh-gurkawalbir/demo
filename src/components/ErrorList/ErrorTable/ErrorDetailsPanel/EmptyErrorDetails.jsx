import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { message } from '../../../../utils/messageStore';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import RawHtml from '../../../RawHtml';

const useStyles = makeStyles(() => ({
  emptyErrorDetails: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  content: {
    textAlign: 'center',
  },
}));
export default function EmptyErrorDetails({ classes, showMessage }) {
  const styles = useStyles();

  return (
    <>
      <DrawerHeader title="Error details" showCloseButton={false} className={classes.draweHeader} />
      {showMessage ? (
        <div className={styles.emptyErrorDetails}>
          <Typography variant="body2" className={styles.content}>
            <RawHtml html={message.ERROR_MANAGEMENT_2.ERROR_DETAILS} />
          </Typography>
        </div>
      ) : null}
    </>
  );
}
