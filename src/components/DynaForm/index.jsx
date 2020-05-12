import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Fragment } from 'react';
import DynaFormGenerator from './DynaFormGenerator';

const useStyles = makeStyles(theme => ({
  fieldContainer: {
    maxHeight: `100%`,
    overflowY: 'auto',
    padding: theme.spacing(1),
    border: 'none',
  },
  details: {
    display: 'block',
    paddingRight: theme.spacing(1),
  },
  expansionPanel: {
    width: '100%',
    overflow: 'hidden',
  },
}));
const DynaForm = props => {
  const {
    className,
    children,
    showValidationBeforeTouched,
    fieldMeta,
    full,
    formKey,
    ...rest
  } = props;
  const classes = useStyles();
  const { fieldMap } = fieldMeta;
  let layout = fieldMeta.fieldMeta;
  // This is a helpful logger to find re-renders of forms.
  // Sometimes forms are rendered in hidden tabs/drawers and thus still
  // cause re-renders, even when hidden outputting the layout makes it easy
  // to identify the source.
  // console.log('RENDER: DynaForm', layout);
  // useTraceUpdate(props);

  if (!formKey) return null;

  if (!layout) {
    if (!fieldMap) {
      return null;
    }

    // if no layout metadata accompanies the fieldMap,
    // then the order in which the fields are defined in the map are used as the layout.
    layout = { fields: [] };
    Object.keys(fieldMap).forEach(fieldId => {
      layout.fields.push(fieldId);
    });
  }

  return (
    <Fragment>
      <div className={clsx(classes.fieldContainer, className)}>
        <DynaFormGenerator
          {...rest}
          layout={layout}
          fieldMap={fieldMap}
          formKey={formKey}
        />
      </div>
    </Fragment>
  );
};

export default DynaForm;
