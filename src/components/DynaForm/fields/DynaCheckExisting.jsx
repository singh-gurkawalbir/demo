import clsx from 'clsx';
import React, { useEffect, useMemo, useRef } from 'react';
import { FormControl, makeStyles, Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSelector } from 'react-redux';
import sift from 'sift';
import { isEqual } from 'lodash';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';

const emptyArray = [];

const useStyles = makeStyles(theme => ({
  dynaLabelWrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  dynaCheckControlLabel: {
    margin: 0,
    marginRight: 4,
    fontSize: 14,
  },
  dynaCheckbox: props => {
    props.hideLabelSpacing ? 0 : 12;
  },
  infoText: {
    color: theme.palette.error.dark,
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    padding: theme.spacing(0, 1),
    alignItems: 'center',
    lineHeight: 1,
  },
}));
// can this be loggable in all circumstances? since it is a checkbox
export default function DynaCheckboxExisting(props) {
  const classes = useStyles(props);
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = '',
    label,
    inverse,
    required,
    isValid,
    className,
    isLoggable,
    labelSubText,
    options,
    flowId,
    flowResourceType,
    resourceType,
    ignoreEnvironmentFilter = false,
    checkPermissions = false,
  } = props;

  const { filter, visible = true, ...otherOptions } = options;
  const resourceIdsToFilter = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);
    const { pageProcessors = [], pageGenerators = [], routers = [] } = flow || {};
    const exportIds = [];
    const importIds = [];

    if (routers.length) {
      routers.forEach(router => {
        (router.branches || []).forEach(branch => {
          (branch.pageProcessors || []).forEach(pp => {
            if (pp._importId) {
              importIds.push(pp._importId);
            } else if (pp._exportId) {
              exportIds.push(pp._exportId);
            }
          });
        });
      });
    }

    // For imports go through pps and extract list of import ids
    if (props.resourceType === 'imports') {
      if (routers.length) return importIds;

      return pageProcessors
        .filter(pp => !!pp._importId)
        .map(pp => pp._importId);
    }

    // For exports , check for lookup and based on that extract from either pp/pg
    if (flowResourceType === 'pg') {
      return pageGenerators
        .filter(pg => !!pg._exportId)
        .map(pg => pg._exportId);
    }

    return routers.length ? exportIds : pageProcessors.filter(pp => !!pp._exportId).map(pp => pp._exportId);
  });

  const updatedFilter = {
    ...filter,
    $and: [
      ...filter.$and,
      { _id: { ...filter._id, $nin: resourceIdsToFilter } },
    ],
  };

  const updatedOptions = {
    ...otherOptions,
    filter: updatedFilter,
  };

  const optionRef = useRef(updatedOptions);

  useEffect(() => {
    if (!isEqual(optionRef.current, updatedOptions)) {
      optionRef.current = updatedOptions;
    }
  }, [updatedOptions]);

  const filterConfig = useMemo(
    () => ({
      type: resourceType,
      ignoreEnvironmentFilter,
    }),
    [ignoreEnvironmentFilter, resourceType]
  );

  const { resources = emptyArray } = useSelectorMemo(
    selectors.makeResourceListSelector,
    filterConfig
  );

  const allRegisteredConnectionIdsFromManagedIntegrations = useSelector(state => selectors.allRegisteredConnectionIdsFromManagedIntegrations(state));

  const resourceItems = useMemo(() => {
    let filteredResources = resources;

    if ((updatedOptions && updatedOptions.filter) || filter) {
      filteredResources = filteredResources.filter(
        sift(updatedOptions && updatedOptions.filter ? updatedOptions.filter : filter)
      );
    }
    if (resourceType === 'connections' && checkPermissions) {
      filteredResources = filteredResources.filter(r => allRegisteredConnectionIdsFromManagedIntegrations.includes(r._id));
    }

    const filteredResourceIds333 = filteredResources.map(conn => {
      const result = {
        label: conn.offline ? `${conn.name || conn._id} - Offline` : conn.name || conn._id,
        value: conn._id,
      };

      if (resourceType === 'connections') {
        return ({
          ...result,
          connInfo: {
            httpConnectorId: conn?.http?._httpConnectorId,
            httpConnectorApiId: conn?.http?._httpConnectorApiId,
            httpConnectorVersionId: conn?.http?._httpConnectorVersionId,
          },
        });
      }

      return result;
    });

    // console.log(filteredResourceIds333,'filteredResourceIds333')

    return filteredResourceIds333;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, optionRef.current, filter, resourceType, checkPermissions, allRegisteredConnectionIdsFromManagedIntegrations]);

  if ((!resourceItems.length) || !visible) {
    return null;
  }

  return (
    <FormControl
      error={!isValid}
      required={required}
      disabled={disabled}
      className={clsx(classes.dynaLabelWrapper, className)}>
      <FormControlLabel
        control={(
          <Checkbox
            key={id}
            name={name}
            {...isLoggableAttr(isLoggable)}
            className={classes.dynaCheckbox}
            // isInvalid={!isValid}
            data-test={id}
            value={String(!!value)}
            checked={inverse ? !value : !!value}
            onChange={evt =>
              onFieldChange(
                id,
                inverse ? !evt.target.checked : evt.target.checked
              )}
          />
        )}
        className={classes.dynaCheckControlLabel}
        label={label}

      />
      {labelSubText && (<Typography variant="caption" className={classes.infoText}>{labelSubText}</Typography>)}

      <FieldHelp {...props} />
      <FieldMessage {...props} />
    </FormControl>
  );
}
