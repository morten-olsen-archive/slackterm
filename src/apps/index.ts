import App, { Store } from './App';
import EchoApp from './Echo';
import WhichApp from './Which';
import SelectApp from './Select';
import UpdateApp from './Update';
import ClearApp from './Clear';
import ListApp from './List';

const apps: {[name: string]: new (store: Store) => App} = {
  echo: EchoApp,
  which: WhichApp,
  select: SelectApp,
  update: UpdateApp,
  clear: ClearApp,
  list: ListApp,
};

export default apps;