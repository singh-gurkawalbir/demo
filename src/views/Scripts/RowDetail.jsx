import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import AuditLogDialog from '../../components/AuditLog/AuditLogDialog';
import ResourceReferences from '../../components/ResourceReferences';

const styles = theme => ({
  scriptActions: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  scriptDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
});

function ScriptsData(props) {
  const { classes, item } = props;
  const dispatch = useDispatch();
  const [showAuditLogDialog, setShowAuditLogDialog] = useState(false);
  const [showReferencesDialog, setShowReferencesDialog] = useState(false);

  function handleAuditLogClick() {
    setShowAuditLogDialog(true);
  }

  function handleAuditLogDialogClose() {
    setShowAuditLogDialog(false);
  }

  function handleReferencesClick() {
    setShowReferencesDialog(true);
  }

  function handleReferencesClose() {
    setShowReferencesDialog(false);
  }

  const handleDeleteClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to delete this script?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('scripts', item._id));
          },
        },
      ],
    });
  };

  return (
    <Fragment>
      {showAuditLogDialog && (
        <AuditLogDialog
          resourceType="scripts"
          resourceId={item._id}
          onClose={handleAuditLogDialogClose}
        />
      )}
      {showReferencesDialog && (
        <ResourceReferences
          type="scripts"
          id={item._id}
          onClose={handleReferencesClose}
        />
      )}

      <Typography className={classes.scriptDetails}>
        Description: {item.description}
      </Typography>

      <Typography className={classes.scriptActions}>
        <Button component={Link} to={getRoutePath(`scripts/edit/${item._id}`)}>
          Edit script
        </Button>
        <br />
        <Button onClick={handleAuditLogClick}>View audit log</Button>
        <br />
        <Button onClick={handleReferencesClick}>View references</Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete script</Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(ScriptsData);
