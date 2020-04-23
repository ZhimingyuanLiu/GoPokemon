import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import UserBoard from './user/UserBoard';
import Profile from './user/Profile';
import userOrder from './user/userOrder';
import dicussion from './user/Discussion';

import AdminBoard from './user/AdminBoard';
import Home from './main/Home';
import PrivateRoutes from './backEnd/PrivateRoute';
import AdminRoutes from './backEnd/AdminRoute';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import Shop from './main/Shop';
import Product from './main/Product';
import Cart from './main/Cart';
import Orders from './admin/Orders';
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact component={Shop} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/product/:productId" exact component={Product} />
        <Route path="/cart" exact component={Cart} />
        <PrivateRoutes path="/user/dashboard" exact component={UserBoard} />
        <PrivateRoutes path="/profile/:userId" exact component={Profile} />
        <PrivateRoutes
          path="/user/orders/:userId"
          exact
          component={userOrder}
        />
        <PrivateRoutes path="/user/dicussion/" exact component={dicussion} />
        <AdminRoutes path="/admin/dashboard" exact component={AdminBoard} />
        <AdminRoutes path="/create/category" exact component={AddCategory} />
        <AdminRoutes path="/create/product" exact component={AddProduct} />
        <AdminRoutes path="/admin/orders" exact component={Orders} />
      </Switch>
    </Router>
  );
};

export default Routes;
