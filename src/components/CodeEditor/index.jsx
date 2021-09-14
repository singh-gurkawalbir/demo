import loadable from '../../utils/loadable';
import retry from '../../utils/retry';

const CodeEditor = loadable(() => retry(() => import(/* webpackChunkName: 'ACECodeEditor' */ './editor')));

export default CodeEditor;
