import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
import FormFragment from '../../Form/FormFragment';
import CollapsedComponents from './CollapsedComponents';
import ColumnComponents from './ColumnComponents';
import {
  TabComponentSimple,
  TabComponentWithoutSave,
  TabIAComponent,
} from './TabComponent';

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

export const getCorrespondingFieldMap = (fields, fieldMap) =>
  fields.map(field => {
    const transformedFieldValue = fieldMap[field];

    if (!transformedFieldValue) {
      // eslint-disable-next-line no-console
      console.warn('no field reference found for field ', field);

      return {};
    }

    return { key: field, ...transformedFieldValue };
  });

const FormFragmentWithDefaultFields = ({ formKey, fields, fieldMap }) => {
  const classes = useStyles();
  const defaultFields = useMemo(
    () => getCorrespondingFieldMap(fields, fieldMap),
    [fields, fieldMap]
  );

  return (
    <FormFragment
      className={classes.child}
      formKey={formKey}
      defaultFields={defaultFields}
    />
  );
};

export default function FormGenerator(props) {
  const classes = useStyles();

  if (!props || !props.layout || !props.fieldMap) return null;
  const { fieldMap, layout, formKey } = props;
  const { fields, containers, type } = layout;
  const fieldsComponent = fields && (
    <FormFragmentWithDefaultFields
      formKey={formKey}
      fields={fields}
      fieldMap={fieldMap}
    />
  );
  let ConvertedContainer;

  if (type === 'collapse') {
    ConvertedContainer = CollapsedComponents;
  } else if (type === 'column') {
    ConvertedContainer = ColumnComponents;
  } else if (type === 'tabIA') {
    // Tab refers to IA settings tab...and each tab would have a save button that would only save that tabs values to IA
    ConvertedContainer = TabIAComponent;
  } else if (type === 'tab') {
    ConvertedContainer = TabComponentSimple;
  } else if (type === 'tabWithoutSave') {
    ConvertedContainer = TabComponentWithoutSave;
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
