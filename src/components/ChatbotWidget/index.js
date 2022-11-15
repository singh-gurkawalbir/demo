import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import {makeStyles} from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import ZendeskChatIcon from '../icons/ZendeskChatIcon';
import CloseIcon from '../icons/CloseIcon';
import useScript from '../../hooks/useScript';
import { selectors } from '../../reducers';

const scriptUrl = process.env.ZD_CHATBOT_URL + process.env.ZD_CHATBOT_KEY;
const scriptId = 'ze-snippet';

const useStyles = makeStyles(theme => ({
  chatbotIcon: {
    position: 'absolute',
    zIndex: 99999999,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  chatIcon: {
    fontSize: theme.spacing(6),
  },
}));

const ChatbotWidget = () => {
  const classes = useStyles();
  const [isOpen, open] = useState(false);
  const { email, name } = useSelector(state => selectors.userProfile(state), shallowEqual) || {};

  useScript(scriptUrl, scriptId, () => {
    // Hiding the default launcher
    window.zE('webWidget', 'hide');

    // Closing the chatbot shows the default launcher, hence hiding the default launcher
    window.zE('webWidget:on', 'close', () => {
      window.zE('webWidget', 'hide');
      open(v => !v);
    });

    // Prefilling values on ticket form
    window.zE('webWidget', 'prefill', {
      email: {
        value: email,
      },
      name: {
        value: name,
      },
    });
  });

  useEffect(() => {
    // Setting the position of the chatbot window
    window.zESettings = {
      webWidget: {
        offset: {
          horizontal: '46px',
          vertical: '46px',
        },
      },
    };
  }, []);

  const handleWidget = () => {
    if (!isOpen) {
      window.zE('webWidget', 'show');
      window.zE('webWidget', 'open');
      open(v => !v);
    } else {
      window.zE('webWidget', 'close');
    }
  };

  return (
    <Draggable>
      <IconButton className={classes.chatbotIcon} onClick={handleWidget}>
        {
          isOpen ? (
            <CloseIcon data-test="close-zd-chatbot" />
          ) : (
            <ZendeskChatIcon className={classes.chatIcon} data-test="open-zd-chatbot" />
          )
        }
      </IconButton>
    </Draggable>
  );
};

export default ChatbotWidget;
