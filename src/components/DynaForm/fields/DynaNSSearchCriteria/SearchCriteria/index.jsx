import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import TrashIcon from '../../../../icons/TrashIcon';
import RefreshIcon from '../../../../icons/RefreshIcon';
import ActionButton from '../../../../ActionButton';
import DynaTypeableSelect from '../../DynaTypeableSelect';
import DynaSelect from '../../DynaSelect';
import DynaText from '../../DynaText';
import {operators, operatorsByFieldType} from './operators';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { useIsLoggable } from '../../../../IsLoggableContextProvider';

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
  headerName: {
    width: '100%',
    wordBreak: 'break-word',
  },
  deleteButton: {
    marginTop: theme.spacing(1),
  },
  formulaTextField: {
    flexDirection: 'column',
  },
  formulaField: {
    marginBottom: 0,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    paddingLeft: theme.spacing(1),
  },
}));

const TableRowMemo = ({obj, classes, handleFieldUpdate, invalidFields, fields, disabled, handleDelete, index}) => {
  const isLoggable = useIsLoggable();

  return useMemo(() => {
    const fieldType = fieldId => fields?.find(f => f.value === fieldId)?.type;
    const field = obj.join ? [obj.join, obj.field].join('.') : obj.field;

    const r =
        {
          ...obj,
          field,
          fieldType: fieldType(field),
        };

    return (
      <div className={classes.rowContainer} key={r.key}>
        <div className={classes.innerRow}>
          <div
            className={clsx(classes.childHeader, classes.formulaTextField, {
              [classes.disabled]: disabled,
            })}>
            <DynaTypeableSelect
              isLoggable
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
            {r.showFormulaField && (
            <DynaText
              isLoggable
              id={`formula-${index}`}
              value={r.formula}
              multiline
              className={classes.formulaField}
              onFieldChange={(id, _value) => {
                handleFieldUpdate(index, _value, 'formula');
              }}
              isValid={!invalidFields?.includes('formula')}
              errorMessages="Please add formula"
              disabled={disabled}
          />
            )}

          </div>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled,
            })}>
            <DynaSelect
              isLoggable
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
              isLoggable={isLoggable}
              id={`searchValue-${index}`}
              onBlur={(_id, _value) => {
                handleFieldUpdate(index, _value, 'searchValue');
              }}
              isValid={!invalidFields?.includes('searchValue')}
              errorMessages="Please enter a value"
              disabled={disabled || r.operator === 'isempty' || r.operator === 'isnotempty'}
              value={r.searchValue} />
          </div>
          <div
            className={clsx(classes.childHeader, {
              [classes.disabled]: disabled || !r.searchValue2Enabled,
            })}>
            <DynaTypeableSelect
              isLoggable={isLoggable}
              id={`searchValue2-${index}`}
              disabled={disabled || !r.searchValue2Enabled}
              onBlur={(_id, _value) => {
                handleFieldUpdate(index, _value, 'searchValue2');
              }}
              isValid={!invalidFields?.includes('searchValue2')}
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
  }, [obj, classes, handleFieldUpdate, invalidFields, fields, disabled, handleDelete, index, isLoggable]);
};

const emptyObject = {};
const emptyArray = [];

export default function SearchCriteriaEditor(props) {
  const { editorId, disabled, value, onRefresh, connectionId, commMetaPath, filterKey, invalidFields = emptyObject, setDisableSave} = props;
  const { data: fields, status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, filterKey);
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchCriteria = useSelector(state =>
    selectors.searchCriteria(state, editorId).searchCriteria || emptyArray
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
    // if any field is updated, enable the save button
    setDisableSave && setDisableSave(false);
  }, [dispatch, editorId, setDisableSave]);

  const handleDelete = useCallback(row => {
    dispatch(actions.searchCriteria.delete(editorId, row));

    // if any row is deleted, enable the save button
    setDisableSave && setDisableSave(false);
  }, [dispatch, editorId, setDisableSave]);

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
            <span className={classes.headerName}>{header.name}</span>
            {header.refreshable && status !== 'requested' && <RefreshIcon onClick={handleRefresh} />}
            {header.refreshable && status === 'requested' && <Spinner sx={{maxWidth: 24}} />}
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
