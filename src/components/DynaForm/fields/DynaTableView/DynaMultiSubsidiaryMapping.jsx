import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CardContent,
  Typography,
  Card,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';
import ActionButton from '../../../ActionButton';
import ExitIcon from '../../../icons/ExitIcon';

const useStyles = makeStyles(theme => ({
  textField: {
    minWidth: 200,
  },
  exitButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

export default function DynaMultiSubsidiaryMapping(props) {
  const { optionsMap, _integrationId, id, onDataChange } = props;
  const addSupportsRefreshToOptions = option => ({
    ...option,
    supportsRefresh: option.id !== 'dummyCustomer',
  });
  const modifiedOptionsMap = optionsMap.map(addSupportsRefreshToOptions);
  const dispatch = useDispatch();
  const { isLoading, shouldReset, data: metadata, fieldType } = useSelector(
    state =>
      selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
  const handleValueChange = useCallback(
    (tableid, value = []) => {
      onDataChange(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );
  const handleRefreshClick = useCallback(
    fieldId => {
      dispatch(
        actions.connectors.refreshMetadata(fieldId, id, _integrationId, {
          key: 'columnName',
        })
      );
    },
    [_integrationId, dispatch, id]
  );
  const handleCleanup = useCallback(() => {
    dispatch(actions.connectors.clearMetadata(id, _integrationId));
  }, [_integrationId, dispatch, id]);

  if (metadata && metadata.optionsMap && Array.isArray(metadata.optionsMap)) {
    metadata.optionsMap = metadata.optionsMap.map(addSupportsRefreshToOptions);
  }

  return (
    <DynaTableView
      {...props}
      hideLabel
      isLoading={isLoading ? fieldType : false}
      shouldReset={shouldReset}
      metadata={metadata}
      onFieldChange={handleValueChange}
      handleCleanupHandler={handleCleanup}
      handleRefreshClickHandler={handleRefreshClick}
      optionsMap={modifiedOptionsMap}
    />
  );
}

export function MultiSubsidiaryMapWidgetDialog(props) {
  const defaults = {
    width: '70vw',
    height: '55vh',
    open: true,
  };
  const { onClose, value } = props;
  const [data, setData] = useState(value);
  const handleDataChange = value => {
    setData(value);
  };

  return (
    <Dialog
      {...defaults}
      onClose={() => onClose()}
      scroll="paper"
      maxWidth={false}>
      <DialogContent>
        <MultiSubsidiaryMapping {...props} onDataChange={handleDataChange} />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          data-test="saveEditor"
          color="primary"
          onClick={() => onClose(true, data)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function MultiSubsidiaryMapping(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const { id, onFieldChange, title } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = useCallback(
    (shouldSave, value) => {
      if (shouldSave) {
        onFieldChange(id, value);
      }

      handleEditorClick();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleEditorClick, id]
  );

  return (
    <Fragment>
      {showEditor && (
        <MultiSubsidiaryMapWidgetDialog {...props} onClose={handleClose} />
      )}
      <Card className={classes.textField}>
        <CardContent>
          <Typography>{title}</Typography>
          <ActionButton
            data-test={id}
            onClick={handleEditorClick}
            className={classes.exitButton}>
            <ExitIcon />
          </ActionButton>
        </CardContent>
      </Card>
    </Fragment>
  );
}
