import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { RouterProvider , Route ,createBrowserRouter ,createRoutesFromElements } from 'react-router-dom';
import { SearchProvider } from './Context/SearchContext';

import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import AddVideo from './Components/Video/AddVideo';
import VideoPage from './Components/Video/VideoPage';
import Channel from './Components/Channel';
import { LoginProvider } from "./Context/LoginContext";
import History from './Components/History';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>} >
      <Route path='' element={<Home/>} />
      <Route path='signup' element={<Signup/>} />
      <Route path='login' element={<Login/>} />
      <Route path='userprofile' element={<UserProfile/>} />
      <Route path='addvideo' element={<AddVideo/>} />
      <Route path='video/:title' element={<VideoPage/>} />
      <Route path='channel/:channelid' element={<Channel/>} />
      <Route path='channel/History' element={<History/>} />
    </Route>
  )
)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginProvider>
      <SearchProvider>
        <RouterProvider router={router}/>
      </SearchProvider>
    </LoginProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
