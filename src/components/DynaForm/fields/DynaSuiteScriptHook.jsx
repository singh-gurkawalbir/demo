import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import DynaText from './DynaText';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    minWidth: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
    '& >.MuiFormControl-root': {
      width: '100%',
    },
  },
}));

export default function DynaSuiteScriptHook(props) {
  const classes = useStyles();
  const {
    id,
    disabled,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
  } = props;
  const handleFieldChange = field => (event, fieldValue) => {
    onFieldChange(id, { ...value, [field]: fieldValue });
  };

  return (
    <Fragment>
      <div className={classes.inputContainer}>
        <InputLabel className={classes.label}>{label}</InputLabel>
        <div className={classes.wrapper}>
          <div className={classes.field}>
            <DynaText
              key={id}
              name={name}
              label="Function"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              error={!isValid}
              value={value.function}
              onFieldChange={handleFieldChange('function')}
            />
          </div>
          <div className={classes.field}>
            <DynaText
              key={id}
              name={name}
              label="File Internal ID"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              error={!isValid}
              value={value.fileInternalId}
              onFieldChange={handleFieldChange('fileInternalId')}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
