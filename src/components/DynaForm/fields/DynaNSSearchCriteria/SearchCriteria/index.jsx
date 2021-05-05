import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import TrashIcon from '../../../../icons/TrashIcon';
import RefreshIcon from '../../../../icons/RefreshIcon';
import ActionButton from '../../../../ActionButton';
import DynaTypeableSelect from '../../DynaTypeableSelect';
import DynaSelect from '../../DynaSelect';
import {operators, operatorsByFieldType} from './operators';
import Spinner from '../../../../Spinner';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '30% 20% 20% 20% 50px',
    gridColumnGap: '1%',
    marginBottom: theme.spacing(0.5),
  },
  disabled: {
    cursor: 'not-allowed',
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  innerRow: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '30% 20% 20% 20% 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
  },
  childHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      width: '100%',
    },
  },
  deleteButton: {
    marginTop: theme.spacing(1),
  },
}));

const TableRowMemo = ({obj, classes, handleFieldUpdate, invalidFields, fields, disabled, handleDelete, index}) =>
  useMemo(() => {
    const fieldType = fieldId => fields?.find(f => f.value === fieldId)?.type;

    const r =
        {
          ...obj,
          field: obj.join ? [obj.join, obj.field].join('.') : obj.field,
          fieldType: fieldType(obj.join ? [obj.join, obj.field].join('.') : obj.field),
        };

    return (
      <div className={classes.rowContainer} key={r.key}>
        <div className={classes.innerRow}>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled,
            })}>
            <DynaTypeableSelect
              id={`field-${index}`}
              labelName="label"
              valueName="value"
              data-test={`field-${index}`}
              value={r.field}
              options={fields}
              isValid={!invalidFields?.includes('field')}
              errorMessages="Please select a field"
              disabled={disabled}
              onBlur={(_, _value) => {
                handleFieldUpdate(index, _value, 'field');
              }}
              />
          </div>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled,
            })}>
            <DynaSelect
              id={`operator-${index}`}
              value={r.operator}
              options={[{ items: operators.filter(op => (operatorsByFieldType[r.fieldType] || operatorsByFieldType.text).includes(op.value)) }]}
              disabled={disabled}
              isValid={!invalidFields?.includes('operator')}
              errorMessages="Please select an operator"
              onFieldChange={(id, _value) => {
                handleFieldUpdate(index, _value, 'operator');
              }}
              />
          </div>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled,
            })}>
            <DynaTypeableSelect
              id={`searchValue-${index}`}
              onBlur={(_id, _value) => {
                handleFieldUpdate(index, _value, 'searchValue');
              }}
              isValid={!invalidFields?.includes('searchValue')}
              errorMessages="Please enter a value"
              disabled={disabled}
              value={r.searchValue} />
          </div>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled || !r.searchValue2Enabled,
            })}>
            <DynaTypeableSelect
              id={`searchValue2-${index}`}
              disabled={disabled || !r.searchValue2Enabled}
              onBlur={(_id, _value) => {
                handleFieldUpdate(index, _value, 'searchValue2');
              }}
              isValid={!r.searchValue2Enabled || r.searchValue2}
              errorMessages="Please enter a value"
              value={r.searchValue2}
              />
          </div>
          <div
            key="delete_button"
            className={clsx(classes.deleteButton, {
              [classes.disabled]: disabled,
            })}>
            <ActionButton
              id={`delete-${index}`}
              data-test={`searchValue2-${index}`}
              onClick={() => {
                handleDelete(index);
              }}
              disabled={disabled}>
              <TrashIcon />
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }, [obj, classes, handleFieldUpdate, invalidFields, fields, disabled, handleDelete, index]);

const emptyObject = {};

export default function SearchCriteriaEditor(props) {
  const { editorId, disabled, value, onRefresh, connectionId, commMetaPath, filterKey, invalidFields = {}} = props;
  const { data: fields, status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey);
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCriteria = useSelector(state =>
    selectors.searchCriteria(state, editorId).searchCriteria || []
  );

  const handleInit = useCallback(() => {
    dispatch(actions.searchCriteria.init(editorId, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleInit();
  }, [dispatch, handleInit]);

  const handleFieldUpdate = useCallback((row, _value, field) => {
    dispatch(actions.searchCriteria.patchField(editorId, field, row, _value));
    // operator should be cleared on changing field
    // available operators for a field will be based on its type
    if (field === 'field') {
      dispatch(actions.searchCriteria.patchField(editorId, 'operator', row, null));
    }
  }, [dispatch, editorId]);

  const handleDelete = useCallback(row => {
    dispatch(actions.searchCriteria.delete(editorId, row));
  }, [dispatch, editorId]);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh(true);
    }
  }, [onRefresh]);
  const headers = [
    {name: 'Field', refreshable: !disabled},
    {name: 'Operator'},
    {name: 'Search Value'},
    {name: 'Search Value 2'},
  ];

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {headers.map(header => (
          <div className={classes.childHeader} key={header.name}>
            <span>{header.name}</span>
            {header.refreshable && status !== 'requested' && <RefreshIcon onClick={handleRefresh} />}
            {header.refreshable && status === 'requested' && <Spinner />}
          </div>
        ))}
      </div>
      <div className={classes.criteriaBody}>
        {[...searchCriteria, emptyObject].map((r, index) => (
          <TableRowMemo
            obj={r}
            classes={classes}
            handleFieldUpdate={handleFieldUpdate}
            invalidFields={invalidFields[index]}
            fields={fields}
            disabled={disabled}
            handleDelete={handleDelete}
            key={r.key}
            index={index}
           />
        ))}
      </div>
    </div>
  );
}
