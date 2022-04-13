import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import ActionGroup from '../ActionGroup';
import OutlinedButton from '../Buttons/OutlinedButton';

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: theme.spacing(1.5),
    minWidth: theme.spacing(40),
    maxWidth: theme.spacing(40),
    borderRadius: 4,
    textAlign: 'left',
  },
  title: {
    color: theme.palette.text.title,
  },
  content: {
    padding: theme.spacing(1, 0),
    overflowY: 'auto',
    lineHeight: '22px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    '& > div > pre': {
      background: theme.palette.background.paper2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      overflowX: 'auto',
    },
  },
  caption: {
    wordBreak: 'break-word',
  },
  actionButtons: {
    minWidth: 'auto',
    '&:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  feedbackTextField: {
    margin: theme.spacing(1, 0),
    width: '100%',
    '& > div': {
      padding: theme.spacing(1.5),
    },
  },
  actionWrapper: {
    display: 'flex',
    paddingTop: theme.spacing(1),
  },
}));

export default function HelpContent({ children, title, caption, fieldId, resourceType }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [feedbackText, setFeedbackText] = useState(false);
  const [feedbackTextValue, setFeedbackTextValue] = useState('');
  const handleUpdateFeedBack = useCallback(
    helpful => () => {
      if (helpful) {
        dispatch(actions.app.postFeedback(resourceType, fieldId, helpful));
      } else {
        setFeedbackText(true);
      }
    },

    [dispatch, fieldId, resourceType]
  );
  const handleSendFeedbackText = useCallback(() => {
    dispatch(
      actions.app.postFeedback(resourceType, fieldId, false, feedbackTextValue)
    );
  }, [dispatch, feedbackTextValue, fieldId, resourceType]);
  const onChange = useCallback(e => {
    setFeedbackTextValue(e.target.value);
  }, []);

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>
      {caption && (
        <Typography variant="caption" className={classes.caption}>
          {caption}
        </Typography>
      )}
      {feedbackText ? (
        <>
          <TextField
            data-private
            name="feedbackText"
            placeholder="Please let us know how we can improve the text area."
            multiline
            onChange={onChange}
            variant="outlined"
            className={classes.feedbackTextField}
          />
          <OutlinedButton
            onClick={handleSendFeedbackText}>
            Submit
          </OutlinedButton>
        </>
      ) : (
        <>
          <Typography variant="subtitle2" component="div" className={classes.content}>{children}</Typography>
          <div className={classes.actionWrapper}>
            <ActionGroup>
              <Typography>Was this helpful?</Typography>
            </ActionGroup>
            <ActionGroup position="right">
              <OutlinedButton
                data-test="yesContentHelpful"
                color="secondary"
                size="small"
                onClick={handleUpdateFeedBack(true)}
                className={classes.actionButtons}>
                Yes
              </OutlinedButton>
              <OutlinedButton
                data-test="noContentHelpful"
                color="secondary"
                size="small"
                onClick={handleUpdateFeedBack(false)}
                className={classes.actionButtons}>
                No
              </OutlinedButton>
            </ActionGroup>
          </div>
        </>
      )}
    </div>
  );
}
