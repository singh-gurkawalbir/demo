import { useMemo, Fragment, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Drawer, makeStyles } from '@material-ui/core';
import ShareStackUserTable from './ShareStackUserTable';
import actions from '../../actions';
import RefreshIcon from '../icons/RefreshIcon';
import UserGroupIcon from '../icons/GroupOfUsersIcon';
import DrawerTitleBarWithAction from '../drawer/TitleBarWithAction';
import IconTextButton from '../IconTextButton';
import InviteUser from './InviteUser';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 824,
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  submit: {
    marginLeft: theme.spacing(4),
    marginTop: theme.spacing(4),
    marginRight: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  textField: {
    width: theme.spacing(50),
  },
  form: {
    marginLeft: theme.spacing(3),
  },
}));

export default function ShareStack(props) {
  const {
    show,
    title = 'Stack sharing',
    stackId,
    onClose,
    stackShareCollectionById,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showInviteUser, setSetInviteUser] = useState(false);
  const handleRefreshClick = useCallback(
    () => dispatch(actions.resource.requestCollection('sshares')),
    [dispatch]
  );
  const handleInviteClick = useCallback(() => {
    setSetInviteUser(true);
  }, []);
  const handleInviteUserClose = useCallback(() => {
    setSetInviteUser(false);
  }, []);
  const action = useMemo(
    () => (
      <Fragment>
        <IconTextButton
          data-test="retrieveStackShares"
          variant="text"
          color="primary"
          onClick={handleRefreshClick}>
          <RefreshIcon />
          Refresh
        </IconTextButton>
        <IconTextButton
          data-test="inviteUserAccessToStack"
          variant="text"
          color="primary"
          onClick={handleInviteClick}>
          <UserGroupIcon />
          Invite user
        </IconTextButton>
      </Fragment>
    ),
    [handleInviteClick, handleRefreshClick]
  );

  return (
    <Drawer
      anchor="right"
      open={show}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBarWithAction
        onClose={onClose}
        title={title}
        helpKey="stack.sharing"
        helpTitle="Stack sharing"
        action={action}
      />
      <div className={classes.content}>
        <InviteUser
          show={showInviteUser}
          stackId={stackId}
          onClose={handleInviteUserClose}
        />
        <ShareStackUserTable stackShareCollection={stackShareCollectionById} />
      </div>
    </Drawer>
  );
}
