import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import CustomerPage from './pages/CustomerPage';
import SupplierPage from './pages/SupplierPage';
import TagPage from './pages/TagPage';
import TaxPage from './pages/TaxPage';
import VariantPage from './pages/VariantPage';
import OrderPage from './pages/OrderPage';
import IntegrationsPage from './pages/IntegrationsPage';
import OrderDetail from './components/OrderDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfitCalculatorPage from './pages/ProfitCalculatorPage';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <PrivateRoute path="/">
            <Layout>
              <Switch>
                <Route exact path="/" component={DashboardPage} />
                <Route exact path="/products" component={ProductPage} />
                <Route path="/products/new" component={ProductDetail} />
                <Route path="/products/edit/:id" component={ProductDetail} />
                <Route path="/products/view/:id" component={ProductDetail} />
                <Route exact path="/categories" component={CategoryPage} />
                <Route exact path="/brands" component={BrandPage} />
                <Route exact path="/customers" component={CustomerPage} />
                <Route exact path="/suppliers" component={SupplierPage} />
                <Route exact path="/tags" component={TagPage} />
                <Route exact path="/taxes" component={TaxPage} />
                <Route exact path="/variants" component={VariantPage} />
                <Route exact path="/orders" component={OrderPage} />
                <Route exact path="/integrations" component={IntegrationsPage} />
                <Route exact path="/orders/:orderId" component={OrderDetail} />
                <Route exact path="/profit-calculator" component={ProfitCalculatorPage} />
                <Route exact path="/calendar" component={CalendarPage} />
                <Route exact path="/todo" component={TodoPage} />
              </Switch>
            </Layout>
          </PrivateRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;