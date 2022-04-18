import React, { useCallback, useState } from 'react';
import { IconButton, Tooltip, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Help from '../../../../Help';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import RefreshIcon from '../../../../icons/RefreshIcon';
import TextButton from '../../../../Buttons/TextButton';
import CeligoDivider from '../../../../CeligoDivider';
import ExpandRowsIcon from '../../../../icons/ExpandRowsIcon';
import CollapseRowsIcon from '../../../../icons/CollapseRowsIcon';
import ArrowDownIcon from '../../../../icons/ArrowDownIcon';
import { ROWS_AS_INPUT_OPTIONS, RECORD_AS_INPUT_OPTIONS, getInputOutputFormat } from '../../../../../utils/mapping';
import ActionGroup from '../../../../ActionGroup';
import Spinner from '../../../../Spinner';
import ArrowPopper from '../../../../ArrowPopper';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  helpButton: {
    padding: 0,
    margin: 2,
  },
  actions: {
    '& > .MuiButtonBase-root': {
      padding: 0,
    },
    '& > :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
    '& > :first-child': {
      marginRight: 0,
    },
  },
  refresh: {
    fontFamily: 'Roboto400',
    fontSize: 14,
  },
  currentContainer: {
    fontFamily: 'Roboto400',
    fontSize: 14,
    height: theme.spacing(2),
    color: theme.palette.secondary.main,
    padding: 0,
    paddingRight: theme.spacing(1),
    marginRight: theme.spacing(-1),
    '& svg': {
      marginLeft: theme.spacing(0.5),
    },
    '&:hover': {
      background: 'none',
      color: theme.palette.text.secondary,
      '& svg': {
        color: theme.palette.text.secondary,
      },
    },
  },
  actionsMenuPopper: {
    maxWidth: 250,
    top: `${theme.spacing(1)}px !important`,
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    maxWidth: 248,
    '& button': {
      minWidth: 0,
      display: 'none',
      paddingRight: theme.spacing(1),
    },
    '&:hover button': {
      display: 'block',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
      '&:first-child': {
        borderRadius: [0, 4, 4, 0],
      },
      '&:last-child': {
        borderRadius: [0, 4, 4, 0],
      },
    },
    '&:last-child': {
      border: 'none',
    },
  },
  itemRoot: {
    wordBreak: 'break-word',
    padding: theme.spacing(1),
    paddingRight: '20%',
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      background: 'none',
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  listWrapper: {
    minWidth: 250,
    maxHeight: 650,
    overflowY: 'auto',
  },
  itemRootName: {
    margin: 0,
    fontSize: 16,
    lineHeight: '39px',
    fontFamily: 'source sans pro',

  },
}));

function OutputFormatsList({isGroupedSampleData, isGroupedOutput, disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const handleMenu = useCallback(
    event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    },
    [anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const changeOutputFormat = useCallback(value => {
    handleClose();
    dispatch(actions.mapping.v2.toggleOutput(value.endsWith('row') ? 'rows' : 'record'));
  }, [dispatch, handleClose]);

  return (
    <>
      <TextButton
        data-test="changeOutputFormat"
        onClick={handleMenu}
        disabled={disabled}
        endIcon={<ArrowDownIcon />}
        className={classes.currentContainer}
        aria-owns={open ? 'outputFormats' : null}
        aria-haspopup="true"
        >
        {getInputOutputFormat(isGroupedSampleData, isGroupedOutput)}
      </TextButton>

      <ArrowPopper
        id="outputFormats"
        onClose={handleClose}
        placement="bottom-end"
        restrictToParent={false}
        classes={{ popper: classes.actionsMenuPopper }}
        open={open}
        anchorEl={anchorEl}
        >
        <List
          dense
          className={classes.listWrapper}
          >
          {(isGroupedSampleData ? ROWS_AS_INPUT_OPTIONS : RECORD_AS_INPUT_OPTIONS).map(({label, value}) => (
            <ListItem
              button
              className={classes.itemRoot}
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              onClick={() => changeOutputFormat(value)}
              key={value}>
              <ListItemText className={classes.itemRootName}>{label}</ListItemText>
            </ListItem>
          ))}
        </List>
      </ArrowPopper>
    </>
  );
}

export default function MapperPanelTitle({editorId, title, helpKey}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const {mappingVersion, flowId, importId, isGroupedSampleData, isGroupedOutput} = useSelector(state => {
    const mapping = selectors.mapping(state) || {};

    return {
      mappingVersion: mapping.version,
      flowId: mapping.flowId,
      importId: mapping.importId,
      isGroupedSampleData: mapping.isGroupedSampleData,
      isGroupedOutput: mapping.isGroupedOutput,
    };
  }, shallowEqual);

  const isExtractsLoading = useSelector(state => {
    const extractStatus = selectors.getSampleDataContext(state, {
      flowId,
      resourceId: importId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).status;

    return extractStatus === 'requested';
  });

  const handleRefreshFlowDataClick = useCallback(() => {
    const refreshCache = true;

    dispatch(
      actions.flowData.requestSampleData(
        flowId,
        importId,
        'imports',
        'importMappingExtract',
        refreshCache
      )
    );
  }, [dispatch, flowId, importId]);

  const handleToggleRows = useCallback(shouldExpand => {
    dispatch(actions.mapping.v2.toggleRows(shouldExpand));
  }, [dispatch]);

  // return the old title if its not mapper2 view
  if (mappingVersion !== 2) {
    return title;
  }

  return (
    <div className={classes.wrapper}>
      Destination record structure
      {helpKey && (
        <Help
          title="Destination record structure"
          className={classes.helpButton}
          helpKey={helpKey}
        />
      )}
      <ActionGroup position="right" className={classes.actions}>
        <OutputFormatsList
          isGroupedSampleData={isGroupedSampleData}
          isGroupedOutput={isGroupedOutput}
          disabled={disabled}
        />

        <CeligoDivider position="right" />

        <TextButton
          data-test="refreshExtracts"
          startIcon={isExtractsLoading ? (
            <Spinner size="small" />
          ) : <RefreshIcon />}
          disabled={disabled}
          onClick={handleRefreshFlowDataClick}
          className={classes.refresh}
          size="small"
          >
          Refresh fields
        </TextButton>
        <CeligoDivider position="right" />

        <Tooltip title="Expand all rows" placement="bottom">
          <IconButton
            size="small"
            date-test="expandAll"
            onClick={() => handleToggleRows(true)}>
            <ExpandRowsIcon />
          </IconButton>
        </Tooltip >

        <Tooltip title="Collapse all rows" placement="bottom">
          <IconButton
            size="small"
            date-test="collapseAll"
            onClick={() => handleToggleRows(false)} >
            <CollapseRowsIcon />
          </IconButton>
        </Tooltip>
      </ActionGroup>
    </div>
  );
}
