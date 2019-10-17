import { FormFragment } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/core/styles';
import CollapsedComponents from './CollapsedComponents';
import ColumnComponents from './ColumnComponents';
import TabComponent from './TabComponent';

// TODO: Checked with little change
const useStyles = makeStyles({
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '& > div + div': {
      width: '100%',
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
    paddingRight: 10,
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

  if (!props || !props.layout || !props.fieldMap) return null;
  const { fieldMap, layout } = props;
  const { fields, containers, type } = layout;
  const fieldsComponent = fields && (
    <FormFragment
      className={classes.child}
      defaultFields={getCorrespondingFieldMap(fields, fieldMap)}
    />
  );
  let ConvertedContainer;

  if (type === 'collapse') {
    ConvertedContainer = CollapsedComponents;
  } else if (type === 'column') {
    ConvertedContainer = ColumnComponents;
  } else if (type === 'tab') {
    ConvertedContainer = TabComponent;
  } else {
    return (
      <div className={classes.fieldsContainer}>
        {fieldsComponent}
        {containers &&
          containers.map((container, index) => (
            <FormGenerator
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
        classes={classes}
        fieldMap={fieldMap}
        containers={containers}
      />
    </div>
  );
}
