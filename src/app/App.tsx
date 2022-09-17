import { FC } from 'react';
import { Playground } from './Playground';

export const App: FC = () => {
  return <Playground pointSize={20} groundSize={[20, 30]} />;
};
