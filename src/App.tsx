import React from 'react';
import Grid from './Grid';

const App: React.FC = () => {
  return (
    <div className="App">
      <Grid rows={5} columns={5} />
    </div>
  );
};

export default App;
