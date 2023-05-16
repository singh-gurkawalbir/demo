import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, ListItemText } from '@mui/material';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { ArrowPopper, TextButton } from '@celigo/fuse-ui';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import { isCsvOrXlsxResourceForMapper2, ROWS_AS_INPUT_OPTIONS, RECORD_AS_INPUT_OPTIONS, getInputOutputFormat } from '../../../../../../utils/mapping';

const useStyles = makeStyles(theme => ({
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
      backgroundColor: theme.palette.background.paper2,
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

export default function OutputFormatsList({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;
  const {isGroupedSampleData, isGroupedOutput, importId} = useSelector(state => {
    const mapping = selectors.mapping(state);

    return {
      isGroupedSampleData: mapping.isGroupedSampleData,
      isGroupedOutput: mapping.isGroupedOutput,
      importId: mapping.importId,
    };
  }, shallowEqual);

  const importResource = useSelectorMemo(selectors.makeResourceSelector, 'imports', importId);
  const disableRecordOutput = isCsvOrXlsxResourceForMapper2(importResource);
  const disableRowsOutput = ['filedefinition', 'fixed', 'delimited/edifact'].includes(importResource?.file?.type);

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
        aria-owns={open ? 'outputFormats' : null}
        aria-haspopup="true"
        size="small"
      >
        {getInputOutputFormat(isGroupedSampleData, isGroupedOutput)}
      </TextButton>

      <ArrowPopper
        id="outputFormats"
        onClose={handleClose}
        placement="bottom-center"
        preventOverflow={false}
        open={open}
        anchorEl={anchorEl}
          >
        <List
          dense
          className={classes.listWrapper}
            >
          {(isGroupedSampleData ? ROWS_AS_INPUT_OPTIONS : RECORD_AS_INPUT_OPTIONS).map(({label, value}) => (
            <ListItem
              disabled={(value.endsWith('rec') && disableRecordOutput) || (value.endsWith('row') && disableRowsOutput)}
              button
              className={clsx(classes.itemRoot, {
                [classes.itemSelected]: label === getInputOutputFormat(isGroupedSampleData, isGroupedOutput),
              })}
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
