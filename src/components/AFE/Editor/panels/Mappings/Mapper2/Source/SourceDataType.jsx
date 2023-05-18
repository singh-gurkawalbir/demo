import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Divider, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useHistory } from 'react-router-dom';
import { ArrowPopper, TextButton } from '@celigo/fuse-ui';
import { DATA_TYPES_DROPDOWN_OPTIONS, DATA_TYPES_REPRESENTATION_LIST, MAPPING_DATA_TYPES } from '../../../../../../../utils/mapping';
import actions from '../../../../../../../actions';
import ArrowDownFilledIcon from '../../../../../../icons/ArrowDownFilledIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  dataType: {
    justifyContent: 'flex-end',
    padding: 0,
    fontStyle: 'italic',
    '& svg': {
      marginLeft: theme.spacing(-1),
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
    '&.Mui-disabled': {
      height: 38,
      paddingRight: theme.spacing(1),
      '& .MuiButton-endIcon': {
        display: 'none',
      },
    },
  },
  itemContainer: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    maxWidth: theme.spacing(31),
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
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: 'transparent',
      left: '0px',
    },
    '&:hover': {
      background: theme.palette.background.paper2,
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  itemSelected: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper2,
    '&:before': {
      content: '""',
      width: '3px',
      height: '100%',
      position: 'absolute',
      background: theme.palette.primary.main,
      left: '0px',
    },
  },
  listWrapper: {
    minWidth: theme.spacing(20),
    maxHeight: theme.spacing(37),
    overflowY: 'auto',
  },
  itemRootName: {
    margin: 0,
    fontSize: 15,
    lineHeight: '42px',
  },
  actionsMenuPopperArrow: {
    left: '50px !important',
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 0.5),
  },
  sourceDataTypeDropDown: {
    display: 'flex',
    alignItems: 'center',
    width: theme.spacing(9),
    marginLeft: '-106px', // using theme.spacing for negative values results in "NaN"
    justifyContent: 'end',
    zIndex: 1,
  },
  dataTypeList: {
    width: theme.spacing(8),
    wordBreak: 'break-word',
    textAlign: 'right',
    whiteSpace: 'normal',
  },
  dataTypeSelected: {
    width: theme.spacing(8),
    textAlign: 'right',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const getToolTipTitle = (isHandlebarExp, isHardCodedValue) => {
  if (isHandlebarExp) {
    return 'The data type of handlebars expressions is auto-set to "string" and cannot be changed.';
  }
  if (isHardCodedValue) {
    return 'The data type of hard-coded values is auto-set to "string" and cannot be changed.';
  }

  return '';
};

export default function SourceDataType({
  disabled,
  nodeKey,
  className,
  anchorEl,
  setAnchorEl,
  sourceDataTypes,
  isHardCodedValue,
  isHandlebarExp,
  isDynamicLookup,
  isFocused,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [sourceDataTypeState, setSourceDataType] = useState([]);
  const open = !!anchorEl;

  useEffect(() => {
    const selectedDataTypeLabels = [];

    if (sourceDataTypes?.length) {
      sourceDataTypes.forEach(datatype => {
        selectedDataTypeLabels.push(DATA_TYPES_REPRESENTATION_LIST[[datatype]]);
      });
    } else {
      selectedDataTypeLabels.push(MAPPING_DATA_TYPES.STRING);
    }
    setSourceDataType(selectedDataTypeLabels);
  }, [sourceDataTypes]);

  const handleMenu = useCallback(
    event => {
      if (sourceDataTypeState && sourceDataTypeState.length > 1) {
        dispatch(actions.mapping.v2.updateActiveKey(nodeKey));

        history.push(buildDrawerUrl({
          path: drawerPaths.MAPPINGS.V2_SETTINGS,
          baseUrl: history.location.pathname,
          params: { nodeKey, test: 'test' },
        }));
      } else {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      }
    },
    [sourceDataTypeState, dispatch, nodeKey, history, setAnchorEl, anchorEl]
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const onDataTypeChange = useCallback(newDataType => {
    handleClose();
    setSourceDataType([newDataType]);
    dispatch(actions.mapping.v2.updateDataType(nodeKey, newDataType, true));
  }, [handleClose, dispatch, nodeKey]);

  // dynamic lookup does not support source field and source data type
  if (isDynamicLookup) {
    return null;
  }

  return (
    <div className={clsx(classes.sourceDataTypeDropDown, className)}>

      <Tooltip
        title={getToolTipTitle(isHandlebarExp, isHardCodedValue)}
        placement="bottom" >
        {/* this span needs to be added to render the tooltip correctly */}
        <span>
          <TextButton
            onClick={handleMenu}
            disabled={disabled}
            endIcon={sourceDataTypes && sourceDataTypes.length > 1 ? '' : <ArrowDownFilledIcon />}
            sx={{
              justifyContent: 'flex-end',
              padding: 0,
              fontStyle: 'italic',
              '& svg': {
                ml: -1,
              },
              '&:focus': {
                color: 'primary.main',
              },
              '&.Mui-disabled': {
                height: 38,
                paddingRight: 1,
                '& .MuiButton-endIcon': {
                  display: 'none',
                },
              },
            }}
            color="primary">
            {/* CeligoTruncate is not used here since it effects the drag and drop functionality */}
            {isFocused ? <span className={classes.dataTypeList}>{sourceDataTypeState.join(', ')}</span> : (
              <span className={classes.dataTypeSelected}>
                {sourceDataTypeState.join()}
              </span>
            )}
          </TextButton>
        </span>
      </Tooltip>
      <Divider className={classes.divider} orientation="vertical" />

      <ArrowPopper
        id="dataTypesList"
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        onClose={handleClose}>
        <List
          dense
          className={classes.listWrapper}>
          {DATA_TYPES_DROPDOWN_OPTIONS.map(opt => (
            <ListItem
              button
              onClick={() => {
                onDataTypeChange(opt.id);
              }}
              className={clsx(classes.itemRoot, {
                [classes.itemSelected]: opt.label === sourceDataTypeState[0],
              })}
              classes={{
                root: classes.itemRoot,
                container: classes.itemContainer,
              }}
              key={opt.id}>
              <ListItemText className={classes.itemRootName}>{opt.label}</ListItemText>
            </ListItem>
          ))}
        </List>

      </ArrowPopper>
    </div>
  );
}

