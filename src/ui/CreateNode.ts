import { Store } from 'redux';
import { Widgets } from 'blessed';
import { State, selectors } from '../state';


type CreateNode = (store: Store<State>) => Widgets.Node;

export default CreateNode;