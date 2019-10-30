import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DynaText from './DynaText';
import { isNewId, getWebhookUrl } from '../../../utils/resource';

const useStyles = makeStyles(() => ({
  children: {
    flex: 1,
  },
}));

function GenerateUrl(props) {
  const {
    onFieldChange,
    resourceId,
    id,
    value,
    buttonLabel,
    formContext,
  } = props;
  const { value: formValues } = formContext;
  const classes = useStyles();
  const dispatch = useDispatch();
  const finalResourceId =
    useSelector(state => selectors.createdResourceId(state, resourceId)) ||
    resourceId;
  const handleGenerateUrl = () => {
    dispatch(
      actions.resourceForm.submit(
        'exports',
        finalResourceId,
        formValues,
        null,
        true
      )
    );
  };

  useEffect(() => {
    if (!isNewId(finalResourceId)) {
      const whURL = getWebhookUrl(formValues, finalResourceId);

      onFieldChange(id, whURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalResourceId, formValues, id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flexBasis: '70%', '& div': { width: '100%' } }}>
        <DynaText
          {...props}
          disabled
          required
          className={classes.children}
          style={{ width: '100%' }}
          value={value}
        />
      </div>
      <div>
        <Button data-test={id} isValid onClick={handleGenerateUrl}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

const DynaGenerateUrlFormContext = props => (
  <FormContext.Consumer {...props}>
    {form => <GenerateUrl {...props} formContext={form} />}
  </FormContext.Consumer>
);

export default DynaGenerateUrlFormContext;
