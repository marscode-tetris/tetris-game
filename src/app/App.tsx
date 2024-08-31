import { FC } from 'react';
import { Playground } from './Playground';
import { observer } from 'mobx-react';

export const App: FC = observer(() => {
  return (
    <>
      <Playground pointSize={20} groundSize={[20, 30]} />
    </>
  );
});
