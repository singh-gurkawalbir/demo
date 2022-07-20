import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../actions';
import TextToggle from '../../../TextToggle';
import { selectors } from '../../../../reducers';
import Help from '../../../Help';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    padding: 0,
  },
  betaLabel: {
    border: '1px solid',
    padding: `0px ${theme.spacing(0.5)}px`,
    fontSize: 11,
    fontWeight: 700,
    marginLeft: theme.spacing(1),
  },
  mapperTextToggle: {
    '&>button': {
      '&:nth-child(1)': {
        minWidth: `${theme.spacing(11)}px !important`,
      },
      '&:nth-child(2)': {
        minWidth: `${theme.spacing(16)}px !important`,
      },
    },
  },
}));

const BetaLabel = () => {
  const classes = useStyles();

  return (
    <>
      Mapper 2.0
      <span className={classes.betaLabel}>
        BETA
      </span>
    </>
  );
};

const toggleMapperOptions = [
  { label: 'Mapper 1.0', value: 1 },
  { label: <BetaLabel />, value: 2, dataTest: 'Mapper 2.0' },
];

export default function ToggleMapperVersion({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const showToggle = useSelector(state => selectors.isMapper2Supported(state));
  const mappingVersion = useSelector(state => selectors.mappingVersion(state));
  const saveInProgress = useSelector(state => selectors.isEditorSaveInProgress(state, editorId));

  const handleVersionToggle = useCallback(newVersion => {
    dispatch(actions.mapping.toggleVersion(newVersion));
  }, [dispatch]);

  if (!showToggle) return null;

  return (
    <>
      <TextToggle
        disabled={saveInProgress}
        value={mappingVersion}
        onChange={handleVersionToggle}
        exclusive
        options={toggleMapperOptions}
        className={classes.mapperTextToggle}
      />
      <Help
        title="Mapper"
        className={classes.helpTextButton}
        helpKey="afe.mappings.toggle"
      />
    </>
  );
}
