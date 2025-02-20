import React from 'react';
import { FormProvider } from './context/FormContext';
import FormBuilder from './components/FormBuilder';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <FormProvider>
        <FormBuilder />
      </FormProvider>
    </div>
  );
}

export default App;