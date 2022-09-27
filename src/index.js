import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { App } from './containers/App';
import { New } from './containers/New';
import { Edit } from './containers/Edit';
import reportWebVitals from './reportWebVitals';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path='*' element={<h1>404</h1>} />
        <Route path='/' element={<App />} />
        <Route path='/new' element={<New />} />
        <Route path='/edit/:id' element={<Edit />} />
      </Routes>
    </HashRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
