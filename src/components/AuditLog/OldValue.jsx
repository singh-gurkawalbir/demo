import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { showViewDiffLink } from './util';
import DiffDialog from './DiffDialog';

const useStyles = makeStyles({
  clickBtn: {
    whiteSpace: 'nowrap',
    padding: 0,
  },
});

export default function OldValue(props) {
  const classes = useStyles();
  const { auditLog: al } = props;
  const [diffObj, setDiffObj] = useState({
    showDiffDialog: false,
    selectedLog: undefined,
  });

  return (
    <Fragment>
      {diffObj.showDiffDialog && (
        <DiffDialog
          auditLog={diffObj.selectedLog}
          onCancelClick={() =>
            setDiffObj({
              showDiffDialog: false,
              selectedLog: undefined,
            })
          }
        />
      )}
      {showViewDiffLink(al.fieldChange.oldValue, al.fieldChange.newValue) ? (
        <Button
          data-test="auditLogChanges"
          color="primary"
          variant="text"
          className={classes.clickBtn}
          onClick={() =>
            setDiffObj({
              showDiffDialog: true,
              selectedLog: al,
            })
          }>
          Click to view
        </Button>
      ) : (
        <Fragment>
          {typeof al.fieldChange.oldValue === 'string'
            ? al.fieldChange.oldValue
            : JSON.stringify(al.fieldChange.oldValue)}
        </Fragment>
      )}
    </Fragment>
  );
}
