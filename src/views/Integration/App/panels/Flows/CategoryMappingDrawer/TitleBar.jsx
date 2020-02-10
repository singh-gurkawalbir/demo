import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography, IconButton, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import CloseIcon from '../../../../../../components/icons/CloseIcon';
import AddIcon from '../../../../../../components/icons/AddIcon';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    '& > :not(:last-child)': {
      marginRight: theme.spacing(2),
    },
  },
  title: {
    flexGrow: 1,
  },
}));

export default function DrawerTitleBar({ flowId, onClose }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      history.goBack();
    }
  }, [history, onClose]);
  const handleAddCategoryClick = () => {
    history.push(`${match.url}/addCategory`);
  };

  return (
    <div className={classes.titleBar}>
      <Typography variant="h3" className={classes.title}>
        {`Edit Mappings: ${
          flowName.length > 55
            ? `${flowName.substring(0, 55 - 3)}...`
            : flowName
        }`}
      </Typography>
      <Button
        variant="contained"
        data-test="addCategory"
        onClick={handleAddCategoryClick}
        color="secondary"
        className={classes.button}>
        <AddIcon /> Add Category
      </Button>
      <Divider orientation="veritical" />
      <IconButton
        data-test="closeCategoryMapping"
        aria-label="Close"
        onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
