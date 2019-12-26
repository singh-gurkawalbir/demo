import { useCallback, useState, Fragment } from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
// import DynaForm from '../DynaForm';
// import DynaText from '../DynaForm/fields/DynaText';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: '12px',
    minWidth: '212px',
    maxWidth: '270px',
    border: '1px solid',
    borderColor: fade(theme.palette.common.black, 0.1),
    borderRadius: '4px',
    textAlign: 'left',
    overflow: 'hidden',
  },
  title: {
    textTransform: 'capitalize',
    color: theme.palette.text.title,
  },
  content: {
    paddingTop: '10px',
    paddingBottom: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
    color: theme.palette.text.primary,
    fontSize: '14px',
    lineHeight: '22px',
  },
  action: {
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    paddingTop: '8px',
    width: '100%',
    overflow: 'hidden',
  },
  actionTitle: {
    float: 'left',
    width: '60%',
  },
  actionButtons: {
    float: 'right',
    textAlign: 'right',
    '& Button': {
      borderColor: theme.palette.divider,
      padding: '3px 5px',
      background: 'none',
      float: 'left',
      minWidth: '30px',
      marginRight: '5px',
      textTransform: 'capitalize',
      borderRadius: '2px',
      lineHeight: 'normal',
      fontSize: '12px',
      letterSpacing: '0px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
}));

function HelpContent(props) {
  const classes = useStyles();
  const { children, title, caption, fieldId, resourceType, onClose } = props;
  const dispatch = useDispatch();
  const [feedbackText, setFeedbackText] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleUpdateFeedBack = useCallback(
    helpful => () => {
      if (helpful) {
        dispatch(actions.postFeedback(resourceType, fieldId, helpful));

        enquesnackbar({ message: 'Feedback noted.Thanks!' });
      } else {
        setFeedbackText(true);
      }
    },

    [dispatch, enquesnackbar, fieldId, resourceType]
  );
  const feedBackFormMeta = {
    fieldMap: {
      feedbackTextField: {
        id: 'feedbackTextField',
        name: 'feedback',
        type: 'text',
        label: 'Feedback',
        defaultValue: '',
      },
    },
    layout: {
      fields: ['feedbackTextField'],
    },
  };
  const handleSendFeedbackText = useCallback(
    values => {
      dispatch(
        actions.postFeedback(resourceType, fieldId, false, values.feedback)
      );

      enquesnackbar({ message: 'Feedback noted.Thanks!' });

      onClose();
    },
    [dispatch, enquesnackbar, fieldId, onClose, resourceType]
  );

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      {caption && <Typography variant="caption">{caption}</Typography>}
      {feedbackText ? (
        <div>
          <Button type="submit" onClick={() => console.log('Hi')}>
            Submit
          </Button>
        </div>
      ) : (
        <Fragment>
          <div className={classes.content}>{children}</div>
          <div className={classes.action}>
            <Typography className={classes.actionTitle}>
              Was this helpful?
            </Typography>
            <div className={classes.actionButtons}>
              <TextField
                id="standard-basic"
                label="Standard"
                variant="filled"
              />
              <Button
                data-test="yesContentHelpful"
                variant="outlined"
                onClick={handleUpdateFeedBack(true)}
                color="secondary">
                Yes
              </Button>
              <Button
                data-test="noContentHelpful"
                variant="outlined"
                color="secondary"
                onClick={handleUpdateFeedBack(false)}>
                No
              </Button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default HelpContent;
