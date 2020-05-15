import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaSelect from './DynaSelect';
import lookupUtil from '../../../utils/lookup';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

// TODO: Enahance to edit/ add lookup from here
export default function DynaSelectLookup(props) {
  const { resourceId } = props;
  const classes = useStyles();
  const resource = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const lookups = lookupUtil.getLookupFromResource(resource);
  const lookupMap = useMemo(
    () => lookups.map(l => ({ label: l.name, value: l.name })),
    [lookups]
  );

  return (
    <div className={classes.root}>
      <DynaSelect {...props} options={[{ items: lookupMap }]} />
    </div>
  );
}
