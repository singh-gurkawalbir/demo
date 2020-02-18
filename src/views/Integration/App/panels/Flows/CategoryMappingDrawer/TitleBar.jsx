import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import CloseIcon from '../../../../../../components/icons/CloseIcon';
import AddIcon from '../../../../../../components/icons/AddIcon';
import IconTextButton from '../../../../../../components/IconTextButton';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
  },
  title: {
    flexGrow: 1,
  },

  divider: {
    height: theme.spacing(3),
    width: 1,
  },
}));

export default function DrawerTitleBar({ flowId, onClose }) {
  const classes = useStyles();
  const history = useHistory();
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const flowName = flow.name || flow._id;
  const handleClick = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      history.goBack();
    }
  }, [history, onClose]);
  const handleAddCategoryClick = () => {};

  return (
    <div className={classes.titleBar}>
      <Typography variant="h3" className={classes.title}>
        {`Edit Mappings: ${
          flowName.length > 55
            ? `${flowName.substring(0, 55 - 3)}...`
            : flowName
        }`}
      </Typography>
      <IconTextButton
        variant="text"
        data-test="addCategory"
        onClick={handleAddCategoryClick}
        color="primary">
        <AddIcon /> Add Category
      </IconTextButton>
      <Divider orientation="veritical" className={classes.divider} />
      <IconButton
        data-test="closeCategoryMapping"
        aria-label="Close"
        onClick={handleClick}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
