// import { useState, useEffect, Fragment } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { makeStyles } from '@material-ui/core/styles';
// import actions from '../../../actions';
// import * as selectors from '../../../reducers';
// import * as completers from '../editorSetup/completers';
// import CodePanel from '../GenericEditor/CodePanel';
// import { Typography } from '@material-ui/core';

// const useStyles = makeStyles(theme => ({
//   editor: {
//     width: '100%',
//     height: '100%',
//     '& > div': {
//       background: theme.palette.background.paper2,
//     },
//     //
//   },
// }));

// export default function HttpMappingAssistant(props) {
//   const { editorId, data, rule } = props;

//   console.log('props', props);
//   const [initTriggered, setInitTriggered] = useState(false);
//   const dispatch = useDispatch();
//   const classes = useStyles();

//   useEffect(() => {});
//   const { result, initChangeIdentifier } = useSelector(state =>
//     selectors.editor(state, editorId)
//   );

//   console.log(result);
//   useEffect(() => {
//     if (!initTriggered && data && rule)
//       dispatch(
//         actions.editor.init(editorId, 'handlebars', {
//           strict: props.strict,
//           autoEvaluate: true,
//           template: rule,
//           data,
//         })
//       );
//     setInitTriggered(true);
//   }, [
//     data,
//     dispatch,
//     editorId,
//     initTriggered,
//     props.data,
//     props.rule,
//     props.strict,
//     rule,
//   ]);

//   return (
//     <Fragment>
//       <Typography variant="h4">Preview</Typography>
//       <div className={classes.editor}>
//         <CodePanel
//           height="100%"
//           width="100%"
//           key={initChangeIdentifier}
//           name="result"
//           value={result ? result.data : ''}
//           mode="text"
//           readOnly
//         />
//       </div>
//     </Fragment>
//   );
// }
