import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import {selectors} from '../../../../../../reducers';
import actions from '../../../../../../actions';
import DynaTypeableSelect from '../../../../../DynaForm/fields/DynaTypeableSelect';
import TrashIcon from '../../../../../icons/TrashIcon';
import ActionButton from '../../../../../ActionButton';

const useStyles = makeStyles(theme => ({
  childHeader: {
    // width: '46%',
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  dragRow: {
    '& > div[class*="dragIcon"]': {
      visibility: 'hidden',
    },
    '&:hover': {
      '& > div[class*="dragIcon"]': {
        visibility: 'visible',
      },
    },
  },
  dragIcon: {
    cursor: 'move',
    background: 'none',
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    // width: '40%',
    flex: 1,
  },
  disableChildRow: {
    cursor: 'not-allowed',
    '& > div > div > div': {
      background: theme.palette.background.paper2,
    },
    '& > button': {
      background: theme.palette.background.paper2,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  hide: {
    display: 'none',
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 6,
    color: theme.palette.text.hint,
  },
  lockedIcon: {
    right: 40,
  },
  deleteBtn: {
    border: 'none',
  },
  mappingIcon: {
    background: theme.palette.secondary.lightest,
    width: 16,
    height: 1,
    display: 'flex',
    alignItems: 'center',
  },
  actionsMapping: {
    display: 'flex',
    minWidth: 36,
    maxWidth: 64,
  },
  deleteMappingRow: {
    width: theme.spacing(4),
    marginRight: theme.spacing(1),

  },
  rowContainer: {
    '&:hover': {

    },
  },
}));
const emptyObject = {};
export default function MappingRow({
  disabled,
  index,
  resourceId,
  flowId,
  mappingKey,
}) {
  const mapping = useSelector(state => {
    const {mappings} = selectors.responseMapping(state);
    const mapping = mappings.find(({key}) => key === mappingKey);

    return mapping || emptyObject;
  }, shallowEqual);
  const { extract, generate } = mapping;
  const dispatch = useDispatch();
  const classes = useStyles();

  const extractFields = useSelector(state => selectors.responseMappingExtracts(state, resourceId, flowId));
  const handleBlur = useCallback((field, value) => {
    dispatch(actions.responseMapping.patchField(field, mappingKey, value));
  }, [dispatch, mappingKey]);

  const handleExtractBlur = useCallback((_id, value) => {
    handleBlur('extract', value);
  }, [handleBlur]);

  const handleGenerateBlur = useCallback((_id, value) => {
    handleBlur('generate', value);
  }, [handleBlur]);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.responseMapping.delete(mappingKey));
  }, [dispatch, mappingKey]);

  return (
    <div
      className={classes.rowContainer}>
      <div className={clsx(classes.innerRow, { [classes.dragRow]: !disabled })}>
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            key={extract}
            id={`extract-${index}`}
            labelName="name"
            valueName="id"
            value={extract}
            options={extractFields}
            disabled={disabled}
            onBlur={handleExtractBlur}
          />
        </div>
        <span className={classes.mappingIcon} />
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: disabled,
          })}>
          <DynaTypeableSelect
            key={generate}
            id={`generate-${index}`}
            value={generate}
            hideOptions
            disabled={disabled}
            onBlur={handleGenerateBlur}
          />
        </div>
        <div className={classes.actionsMapping}>
          <div
            key="delete_button"
            className={clsx(classes.deleteMappingRow, {
              [classes.disableChildRow]: disabled,
            })}>
            <ActionButton
              data-test={`delete-${index}`}
              aria-label="delete"
              disabled={disabled}
              onClick={handleDeleteClick}
              className={classes.deleteBtn}
              >
              <TrashIcon />
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
