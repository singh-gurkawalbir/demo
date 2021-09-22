import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clsx from 'clsx';
import { Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../../../reducers';
import CloseIcon from '../../../../../../components/icons/CloseIcon';
import AddIcon from '../../../../../../components/icons/AddIcon';
import Help from '../../../../../../components/Help';
import BackArrowIcon from '../../../../../../components/icons/BackArrowIcon';
import { TextButton } from '../../../../../../components/Buttons';

const useStyles = makeStyles(theme => ({
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  title: {
    flexGrow: 1,
  },
  helpTextButton: {
    float: 'right',
    padding: 1,
    margin: theme.spacing(0, 1, 0, 2),
  },
  divider: {
    height: theme.spacing(3),
    width: 1,
    marginRight: theme.spacing(1),
  },
  button: {
    padding: '4px 10px',
    marginRight: theme.spacing(0.5),
    color: theme.palette.secondary.light,
  },
  closeIcon: {
    padding: theme.spacing(0.5),
  },
  arrowLeft: {
    float: 'left',
    padding: 0,
    marginLeft: '-10px',
    marginRight: '10px',
    '&:hover': {
      background: 'none',
      color: theme.palette.secondary.dark,
    },
  },
}));

export default function DrawerTitleBar({
  flowId,
  onClose,
  title,
  addCategory,
  backToParent,
  parentUrl,
  help,
  className,
  disableClose,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const flowName = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    return flow ? flow.name : flowId;
  });
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
    <div className={clsx(classes.titleBar, className)}>

      <Typography variant="h3" className={classes.title}>
        {backToParent && (
          <IconButton
            data-test="backToCateogryMapping"
            aria-label="back"
            onClick={handleClose}
            className={classes.arrowLeft}>
            <BackArrowIcon />
          </IconButton>
        )}
        {title ||
            `${addCategory ? 'Add category: ' : 'Edit mappings:'} ${
              flowName.length > 40
                ? `${flowName.substring(0, 40 - 3)}...`
                : flowName
            }`}
      </Typography>
      {!addCategory && (
      <TextButton
        startIcon={<AddIcon />}
        data-test="addCategory"
        onClick={handleAddCategoryClick}
        className={classes.button}>
        Add Category
      </TextButton>
      )}
      {/* TODO:Sravan we need to add the help for add category and variation mapping */}
      {help && (
      <Help
        title="Help"
        className={classes.helpTextButton}
        helpKey="test"
        helpText="Dummy content here now, just to give styling to the element"
          />
      )}
      <Divider orientation="vertical" className={classes.divider} />
      <IconButton
        data-test="closeCategoryMapping"
        aria-label="Close"
        disabled={disableClose}
        onClick={handleClose}
        className={classes.closeIcon}>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
