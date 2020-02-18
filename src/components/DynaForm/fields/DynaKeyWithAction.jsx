import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ErroredMessageComponent from './ErroredMessageComponent';
import EditIcon from '../../icons/EditIcon';
import DeleteOutlinedIcon from '../../icons/TrashIcon';

const useStyles = makeStyles({
  container: {
    minWidth: props => props.minWidth || '500px',
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
});

export default function DynaKeyWithAction(props) {
  const {
    value,
    onEditClick,
    onDeleteClick,
    onClick,
    keyName = 'key',
    id,
  } = props;
  const classes = useStyles(props);
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
          <Typography onClick={onClick} className={classes.label}>
            {r[keyName]}
          </Typography>
          <div>
            {onEditClick && (
              <IconButton
                key="Edit"
                aria-label="Edit"
                data-test="edit"
                color="inherit"
                onClick={() => onEditClick(r)}>
                <EditIcon />
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

      <ErroredMessageComponent {...props} />
    </div>
  );
}
