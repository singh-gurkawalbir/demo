import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '500px',
  },
  helpText: {
    whiteSpace: 'pre-line',
  },
  label: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '75%',
    float: 'left',
  },
  rowContainer: {
    display: 'flex',
  },
}));

export default function DynaKeyWithAction(props) {
  const {
    value,
    onEditClick,
    onDeleteClick,
    keyName = 'key',
    description,
    errorMessages,
    isValid,
    id,
  } = props;
  const classes = useStyles();
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (value) {
      setValues(value);
    }
  }, [value]);

  const tableData = values ? values.map((r, n) => ({ ...r, row: n })) : [];

  return (
    <div data-test={id} className={classes.container}>
      {tableData.map(r => (
        <div className={classes.rowContainer} key={r.row}>
          <Typography className={classes.label}>{r[keyName]}</Typography>
          <div>
            {onEditClick && (
              <IconButton
                key="Edit"
                aria-label="Edit"
                data-test="edit"
                color="inherit"
                onClick={() => onEditClick(r)}>
                <EditOutlinedIcon />
              </IconButton>
            )}

            {onDeleteClick && (
              <IconButton
                data-test="delete"
                key="Delete"
                aria-label="Delete"
                color="inherit"
                onClick={() => onDeleteClick(r)}>
                <DeleteOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}

      <FormHelperText className={classes.helpText} error={!isValid}>
        {isValid ? description : errorMessages}
      </FormHelperText>
    </div>
  );
}
