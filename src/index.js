import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

// 导入 react-virtualized 组件的样式
import 'react-virtualized/styles.css'

import './assets/fonts/iconfont.css'
import './index.css'

// 将组件导入放在样式导入之后，避免自己写的样式被覆盖的问题
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
