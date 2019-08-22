import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import IconButton from '@material-ui/core/IconButton';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

const useStyles = makeStyles(() => ({
  container: {
    minWidth: '500px',
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
    editHandler,
    deleteHandler,
    keyName = 'key',
    description,
    errorMessages,
    isValid,
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
    <div className={classes.container}>
      {tableData.map(r => (
        <div className={classes.rowContainer} key={r.row}>
          <Typography className={classes.label}>{r[keyName]}</Typography>
          <div>
            {editHandler && (
              <IconButton
                key="Edit"
                aria-label="Edit"
                color="inherit"
                onClick={() => editHandler(r)}>
                <EditOutlinedIcon />
              </IconButton>
            )}

            {deleteHandler && (
              <IconButton
                key="Close"
                aria-label="Close"
                color="inherit"
                onClick={() => deleteHandler(r)}>
                <CloseOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}

      <FormHelperText className={classes.helpText}>
        {isValid ? description : errorMessages}
      </FormHelperText>
    </div>
  );
}
