import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import TrashIcon from '../../icons/TrashIcon';
import ActionButton from '../../ActionButton';
import MappingConnectorIcon from '../../icons/MappingConnectorIcon';

const useStyles = makeStyles(theme => ({
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  childHeader: {
    width: '46%',
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
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: theme.palette.text.hint,
  },

  deleteBtn: {
    border: 'none',
    width: 0,
    background: 'none',
    '&:hover': {
      background: 'none',
    },
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: theme.spacing(6),
  },
}));

export default function MappingRow(props) {
  const {
    value,
    extractFields = [],
    onFieldUpdate,
    disabled,
    onDelete,
  } = props;
  const { extract, generate, index } = value || {};
  const classes = useStyles();
  const handleBlur = useCallback(
    type => (id, value) => {
      onFieldUpdate(index, type, value);
    },
    [index, onFieldUpdate]
  );
  const handleDeleteClick = useCallback(() => {
    onDelete(index);
  }, [index, onDelete]);

  return (
    <div className={classes.rowContainer}>
      <div className={classes.innerRow}>
        <div className={clsx(classes.childHeader, classes.mapField)}>
          <DynaTypeableSelect
            id={`extract-${index}`}
            labelName="name"
            valueName="id"
            value={extract}
            options={extractFields}
            disabled={disabled}
            onBlur={handleBlur('extract')}
          />
        </div>
        <MappingConnectorIcon className={classes.mappingIcon} />
        <div className={clsx(classes.childHeader, classes.mapField)}>
          <DynaTypeableSelect
            id={`generate-${index}`}
            value={generate}
            hideOptions
            disabled={disabled}
            onBlur={handleBlur('generate')}
          />
        </div>
        <div>
          <ActionButton
            data-test={`delete-${index}`}
            aria-label="delete"
            disabled={disabled}
            onClick={handleDeleteClick}
            className={classes.deleteBtn}>
            <TrashIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
