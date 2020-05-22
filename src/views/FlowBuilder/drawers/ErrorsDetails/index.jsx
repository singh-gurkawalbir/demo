import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import RightDrawer from '../../../../components/drawer/Right';
import ErrorList from '../../../../components/ErrorList';

const useStyle = makeStyles(theme => ({
  scheduleContainer: {
    width: '100%',
    overflowX: 'hidden',
    marginTop: -1,
    padding: theme.spacing(-1),
    '& > div': {
      padding: theme.spacing(3, 0),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: 2,
  },
}));

export default function ErrorDetailsDrawer({ flowId }) {
  const history = useHistory();
  const handleClose = useCallback(() => history.goBack(), [history]);
  const classes = useStyle();

  return (
    <RightDrawer
      path="errors/:resourceId"
      width="full"
      title="Error List"
      variant="temporary"
      hideBackButton>
      <ErrorList
        flowId={flowId}
        onClose={handleClose}
        className={classes.scheduleContainer}
      />
    </RightDrawer>
  );
}
