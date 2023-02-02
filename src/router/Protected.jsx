import React from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../store/store';




const Protected = ({ children }) => {
  
  const isSignedIn = useStore(state => state.isSignedIn);
  if (!isSignedIn) {
    return <Navigate to="/auth/*" replace />
  }
  return children
}
export default Protected