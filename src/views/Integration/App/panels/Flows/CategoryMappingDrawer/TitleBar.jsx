import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import CloseIcon from '../../../../../../components/icons/CloseIcon';
import AddIcon from '../../../../../../components/icons/AddIcon';
import LoadResources from '../../../../../../components/LoadResources';
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

export default function DrawerTitleBar({
  flowId,
  onClose,
  title,
  addCategory,
  parentUrl,
}) {
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
      history.push(parentUrl);
    }
  }, [history, onClose, parentUrl]);
  const handleAddCategoryClick = () => {
    history.push(`${match.url}/addCategory`);
  };

  return (
    <div className={classes.titleBar}>
      <LoadResources required resources="flows">
        <Typography variant="h3" className={classes.title}>
          {title ||
            `${addCategory ? 'Add category: ' : 'Edit Mappings:'} ${
              flowName.length > 40
                ? `${flowName.substring(0, 40 - 3)}...`
                : flowName
            }`}
        </Typography>
        {!addCategory && (
          <IconTextButton
            variant="text"
            data-test="addCategory"
            onClick={handleAddCategoryClick}
            color="secondary"
            className={classes.button}>
            <AddIcon /> Add Category
          </IconTextButton>
        )}
        <Divider orientation="veritical" className={classes.divider} />
        <IconButton
          data-test="closeCategoryMapping"
          aria-label="Close"
          onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </LoadResources>
    </div>
  );
}
