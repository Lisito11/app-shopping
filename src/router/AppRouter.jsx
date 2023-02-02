import { Route, Routes } from 'react-router-dom';
import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { ShoppingRoutes } from '../shopping/routes/ShoppingRoutes';
import { useStore } from '../store/store';
import Protected from './Protected';


export const AppRouter = () => {

  const isSignedIn = useStore(state => state.isSignedIn);

  return (
    <Routes>

        {
          isSignedIn ?  "" : <Route path="/auth/*" element={ <AuthRoutes /> } /> 
        }

        <Route path="/*" element={ 
        <Protected isSignedIn={isSignedIn}>
                <ShoppingRoutes />
        </Protected>} />


    </Routes>
  )
}
