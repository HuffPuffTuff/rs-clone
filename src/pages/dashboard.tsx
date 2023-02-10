import React, { useContext, useEffect } from 'react';
import UserContext from '../context/user-context';
import Menu from '../components/menu/menu';
import * as ROUTES from '../constants/routes';
import { redirect, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  useEffect(() => {
    if (user === null) {
      navigate(ROUTES.LOGIN);
      // return redirect(ROUTES.LOGIN)
    }
  });
  
  return (
    <div>
      <Menu />
    </div>
  );
}