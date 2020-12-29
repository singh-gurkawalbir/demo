import loadable from '../../utils/loadable';
import retry from '../../utils/retry';

const CodeEditor = loadable(() => retry(() => import(/* webpackChunkName: 'CodeEditor2' */ './editor')));

export default CodeEditor;
