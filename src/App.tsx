import './styles/index.scss'
import './App.scss';
import Header from './components/Header/Header'
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react';

const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  }
)
function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="App">
        <Header className="header" appName="app name" />
        <div className="main">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
    <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
