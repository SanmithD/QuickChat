import { Loader as Spinner } from 'lucide-react';
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/UseAuthStore";
import { useThemeStore } from './store/UseThemeStore';

const Home = lazy(()=> import("./pages/Home"));
const Signup = lazy(()=> import("./pages/Signup"));
const Login = lazy(()=> import("./pages/Login"));
const Profile = lazy(()=> import("./pages/Profile"));
const Settings = lazy(()=> import("./pages/Settings"));

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();


  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  console.log(authUser);

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen " >
        <Spinner className="size-10 animate-spin"/>
      </div>
    )
  }

  return (
    <div data-theme={theme} >
      <Suspense fallback={<Loader/>} >
      <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <Home/> : <Navigate to="/login"/> } />
          <Route path="/signup" element={ !authUser ? <Signup/> : <Navigate to="/"/> } />
          <Route path="/login" element={!authUser ? <Login/> : <Navigate to="/"/>} />
          <Route path="/profile" element={authUser ?  <Profile/> : <Navigate to="/login"/> }/>
          <Route path="/settings" element={<Settings/>} />
        </Routes>
        <Toaster/>
      </Suspense>
    </div>
  );
}

export default App;
