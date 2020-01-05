import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import TrashIcon from '../../icons/TrashIcon';
import ActionButton from '../../ActionButton';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import operators from './operators';

const { deepClone } = require('fast-json-patch');

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
    '& > div': {
      width: '100%',
    },
  },
}));

export default function SearchCriteriaEditor(props) {
  const { editorId, disabled, value, fieldOptions = {} } = props;
  const {
    fields = [],
    valueName: fieldValueName,
    labelName: fieldLabelName,
  } = fieldOptions;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { searchCriteria = [], initChangeIdentifier = 0 } = useSelector(state =>
    selectors.searchCriteria(state, editorId)
  );
  const handleInit = useCallback(() => {
    dispatch(actions.searchCriteria.init(editorId, value));
  }, [dispatch, editorId, value]);

  useEffect(() => {
    handleInit();
  }, [dispatch, handleInit]);

  const handleFieldUpdate = (row, _value, field) => {
    dispatch(actions.searchCriteria.patchField(editorId, field, row, _value));
  };

  const handleDelete = row => {
    dispatch(actions.searchCriteria.delete(editorId, row));
  };

  const searchCriteriaCopy = deepClone(searchCriteria);

  searchCriteriaCopy.push({});
  const tableData = (searchCriteriaCopy || []).map((value, index) => {
    const obj = value;

    obj.index = index;

    return obj;
  });
  const headers = ['Field', 'Operator', 'Search Value', 'Search Value 2'];

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {headers.map(headerText => (
          <Typography
            key={headerText}
            variant="h5"
            className={classes.childHeader}>
            {headerText}
          </Typography>
        ))}
      </div>
      <div key={initChangeIdentifier} className={classes.criteriaBody}>
        {tableData.map(r => (
          <div className={classes.rowContainer} key={r.index}>
            <div className={classes.innerRow}>
              <div
                className={clsx(classes.childHeader, {
                  [classes.disabled]: disabled,
                })}>
                <DynaTypeableSelect
                  key={`field-${initChangeIdentifier}-${r.rowIdentifier}`}
                  id={`field-${r.index}`}
                  labelName={fieldLabelName}
                  valueName={fieldValueName}
                  data-test={`field-${r.index}`}
                  value={r.field}
                  options={fields}
                  disabled={disabled}
                  onBlur={(_, _value) => {
                    handleFieldUpdate(r.index, _value, 'field');
                  }}
                />
              </div>
              <div
                className={clsx(classes.childHeader, {
                  [classes.disabled]: disabled,
                })}>
                <DynaTypeableSelect
                  key={`operator-${initChangeIdentifier}-${r.rowIdentifier}`}
                  id={`operator-${r.index}`}
                  value={r.operator}
                  options={operators}
                  labelName="name"
                  valueName="value"
                  disabled={disabled}
                  onBlur={(id, _value) => {
                    handleFieldUpdate(r.index, _value, 'operator');
                  }}
                />
              </div>
              <div
                className={clsx(classes.childHeader, {
                  [classes.disabled]: disabled,
                })}>
                <DynaTypeableSelect
                  id={`searchValue-${r.index}`}
                  key={`searchValue-${initChangeIdentifier}-${r.rowIdentifier}`}
                  onBlur={(_id, _value) => {
                    handleFieldUpdate(r.index, _value, 'searchValue');
                  }}
                  disabled={disabled}
                  value={r.searchValue}
                />
              </div>
              <div
                className={clsx(classes.childHeader, {
                  [classes.disabled]: disabled || !r.searchValue2Enabled,
                })}>
                <DynaTypeableSelect
                  id={`searchValue2-${r.index}`}
                  disabled={disabled || !r.searchValue2Enabled}
                  key={`searchValue2-${initChangeIdentifier}-${r.rowIdentifier}`}
                  onBlur={(_id, _value) => {
                    handleFieldUpdate(r.index, _value, 'searchValue2');
                  }}
                  value={r.searchValue2}
                />
              </div>
              <div
                key="delete_button"
                className={clsx({
                  [classes.disabled]: disabled,
                })}>
                <ActionButton
                  id={`delete-${r.index}`}
                  data-test={`searchValue2-${r.index}`}
                  onClick={() => {
                    handleDelete(r.index);
                  }}
                  disabled={disabled}>
                  <TrashIcon />
                </ActionButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
