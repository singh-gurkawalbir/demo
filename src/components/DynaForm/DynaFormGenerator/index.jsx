import React, { useMemo } from 'react';
import { FormFragment } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import CollapsedComponents from './CollapsedComponents';
import ColumnComponents from './ColumnComponents';
import {
  TabIAComponent,
  TabComponentSimple,
  TabComponentWithoutSave,
  TabComponentWithoutSaveVertical,
  SuiteScriptTabIAComponent
} from './TabComponent';
import IndentedComponents from './IndentedComponents';
import BoxComponents from './BoxComponents';

// TODO: Checked with little change
const useStyles = makeStyles({
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& > div + div': {
      width: '100%',
      textAlign: 'left',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
    marginBottom: 6,
  },
});
const getCorrespondingFieldMap = (fields, fieldMap) =>
  fields.map(field => {
    const transformedFieldValue = fieldMap[field];

    if (!transformedFieldValue) {
      // eslint-disable-next-line no-console
      console.warn('no field reference found for field ', field);

      return {};
    }

    return { key: field, ...transformedFieldValue };
  });

export default function FormGenerator(props) {
  const classes = useStyles();
  const {layout, fieldMap} = props || {};

  const { fields, containers, type } = layout || {};

  const defaultFields = useMemo(() => {
    if (!fields || !fieldMap) return null;

    return getCorrespondingFieldMap(fields, fieldMap);
  }, [fieldMap, fields]);
  if (!layout || !fieldMap) return null;

  const fieldsComponent = fields && (
    <FormFragment
      className={classes.child}
      defaultFields={defaultFields}
    />
  );
  let ConvertedContainer;

  if (type === 'collapse') {
    ConvertedContainer = CollapsedComponents;
  } else if (type === 'box') {
    ConvertedContainer = BoxComponents;
  } else if (type === 'indent') {
    ConvertedContainer = IndentedComponents;
  } else if (type === 'column') {
    ConvertedContainer = ColumnComponents;
  } else if (type === 'tabIA') {
    // Tab refers to IA settings tab...and each tab would have a save button that would only save that tabs values to IA
    ConvertedContainer = TabIAComponent;
  } else if (type === 'suitScriptTabIA') {
    // similar to tabIa behavior except used in suitescript
    ConvertedContainer = SuiteScriptTabIAComponent;
  } else if (type === 'tab') {
    ConvertedContainer = TabComponentSimple;
  } else if (type === 'tabWithoutSave') {
    ConvertedContainer = TabComponentWithoutSave;
  } else if (type === 'verticalTabWithoutSave') {
    ConvertedContainer = TabComponentWithoutSaveVertical;
  } else {
    return (
      <div className={classes.fieldsContainer}>
        {fieldsComponent}
        {containers &&
          containers.map((container, index) => (
            <FormGenerator
              {...props}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              classes={classes}
              fieldMap={fieldMap}
              layout={container}
            />
          ))}
      </div>
    );
  }

  return (
    <div className={classes.fieldsContainer}>
      {fieldsComponent}
      <ConvertedContainer
        {...props}
        classes={classes}
        fieldMap={fieldMap}
        containers={containers}
      />
    </div>
  );
}
