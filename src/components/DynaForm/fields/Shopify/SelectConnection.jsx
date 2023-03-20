import React, { useMemo } from 'react';
import { FormHelperText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DynaSelectResource from '../DynaSelectResource';
import { selectors } from '../../../../reducers';
import messageStore, { message } from '../../../../utils/messageStore';
import InfoIcon from '../../../icons/InfoIcon';
import { capitalizeFirstLetter } from '../../../../utils/string';
import { useSelectorMemo } from '../../../../hooks';

const useStyles = makeStyles(theme => ({
  infoIcon: {
    marginRight: 5,
  },
  descriptionWrapper: {
    marginTop: theme.spacing(1),
    lineHeight: '20px',
  },
  infoMsgContainer: {
    color: theme.palette.secondary.main,
    display: 'flex',
    '& > svg': {
      marginTop: 2,
      fontSize: theme.spacing(2),
      color: theme.palette.info.main,
    },
  },
  list: {
    marginBlockStart: 0,
    paddingInlineStart: '20px',
  },
}));

export default function DynaShopifyConnectionSelect(props) {
  const classes = useStyles();
  const {
    value,
    resourceType,
  } = props;

  const resource = useSelectorMemo(selectors.makeResourceSelector, resourceType, value);

  const infoMessages = useMemo(() => {
    const infoMessages = [];

    if (resource?.offline) {
      infoMessages.push(message.SHOPIFY_LANDING_PAGE.OFFLINE_CONNECTION_MESSAGE);
    }
    if (resource?.http?.auth?.type && resource?.http?.auth?.type !== 'oauth') {
      infoMessages.push(messageStore('SHOPIFY_LANDING_PAGE.CONNECTION_TYPE_CHANGE_INFO', {
        type: capitalizeFirstLetter(resource?.http?.auth?.type),
      }));
    }

    return infoMessages;
  }, [resource?.http?.auth?.type, resource?.offline]);

  return (
    <>
      <DynaSelectResource
        {...props}
      />
      {infoMessages.length > 0 && (
        <FormHelperText
          className={classes.descriptionWrapper}
          component="div"
        >
          <div className={classes.infoMsgContainer}>
            {infoMessages.length === 1 ? (
              <>
                <InfoIcon className={classes.infoIcon} />
                {infoMessages[0]}
              </>
            ) : (
              <>
                <InfoIcon />
                <ul className={classes.list}>
                  {infoMessages.map(eachMsg => (
                    <li key={eachMsg}>
                      {eachMsg}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </FormHelperText>
      )}
    </>
  );
}
