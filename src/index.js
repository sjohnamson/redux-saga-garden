import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware, } from 'redux';
import { useEffect } from 'react';
import { Provider} from 'react-redux';
import { logger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

import App from './App';

function* rootSaga() {
  console.log('in rootSaga')
  yield takeLatest('FETCH_FLOWERS', fetchFlowers)
}

function* fetchFlowers(action) {
  try {
    const flowerResponse = yield axios.get(`http://localhost:5000/api/plant`);
    yield put({ type: 'SET_GARDEN', payload: flowerResponse.data })
  }
  catch (error) {
    console.error('Error fetching fruit', error)
  }
}

const plantList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [...state, action.payload]
    case 'SET_GARDEN':
      return action.payload
    default:
      return state;
  }
};

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger),
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);