import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormLabel, FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import DynaTypeableSelect from './DynaTypeableSelect';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import FieldHelp from '../FieldHelp';
import RefreshIcon from '../../icons/RefreshIcon';
import ActionButton from '../../ActionButton';

const useStyles = makeStyles(() => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    '& > div:first-child': { width: '100%' },
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  selectWrapper: {
    width: '100%',
  },
}));

export default function DynaNetSuiteDefaultValue(props) {
  const {
    id,
    commMetaPath,
    multiselect,
    required,
    connectionId,
    value,
    isValid,
    helpKey,
    label,
    disabled,
    onFieldChange,
    filterKey,
    isLoggable,
    options = {},
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data, status } = useSelector(state =>
    selectors.metadataOptionsAndResources(state, {
      connectionId,
      commMetaPath,
      filterKey: options.filterKey || filterKey,
    })
  );

  const handleBlur = useCallback((id1, val) => {
    onFieldChange(id, val);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]
  );

  useEffect(() => {
    if (!status) {
      dispatch(
        actions.metadata.request(
          connectionId,
          options.commMetaPath || commMetaPath,
        )
      );
    }
  }, [commMetaPath, connectionId, dispatch, options.commMetaPath, status]);

  const onRefresh = useCallback(() => {
    dispatch(
      actions.metadata.refresh(
        connectionId,
        options.commMetaPath || commMetaPath,
        {
          refreshCache: true,
        }
      )
    );
  }, [commMetaPath, connectionId, dispatch, options.commMetaPath]);

  if (!status || status === 'requested') {
    return <Spinner />;
  }

  return multiselect ? (
    <DynaRefreshableSelect {...props} />
  )
    : (
      <div className={classes.selectWrapper}>
        <div className={classes.labelWrapper}>
          <FormLabel htmlFor={id} required={required} error={!isValid}>
            {label}
          </FormLabel>
          {helpKey && <FieldHelp {...props} helpKey={helpKey} />}
        </div>
        <FormControl
          variant="standard"
          disabled={disabled}
          className={classes.formControl}
          key={value}>
          <DynaTypeableSelect
            id={id}
            labelName="label"
            valueName="value"
            value={value}
            options={data}
            hideDropdownOnChange
            isLoggable={isLoggable}
            disabled={disabled}
            onBlur={handleBlur}
    />
          {status === 'refreshed' ? <Spinner />

            : (
              <ActionButton
                onClick={onRefresh}
                data-test="refreshResource">
                <RefreshIcon />
              </ActionButton>
            )}

        </FormControl>

      </div>
    );
}
