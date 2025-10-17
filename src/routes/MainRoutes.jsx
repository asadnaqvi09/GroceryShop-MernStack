import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";
import Navigation from "../components/layout/Navigation";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "../../../../Online-Book-Store/FrontEnd/src/layout/PageWrapper";
import Landing from "../pages/mainWeb/LandingPage/Landing";
import ProductListing from "../pages/mainWeb/ProductListing/ProductListing";
import SearchPage from "../components/layout/SearchPage";
import Cart from "../components/layout/Cart";
import WishList from "../components/layout/Wishlist";
import ProtectedRoute from "../routes/ProtectedRoutes";
import Login from "../pages/mainWeb/Auth Page/Login";
import Register from "../pages/mainWeb/Auth Page/Register";
import ForgotPassword from "../pages/mainWeb/Auth Page/ForgotPassword";
import VerifyOTP from "../pages/mainWeb/Auth Page/Verify-OTP";
import Footer from "../components/layout/Footer";
import CheckOut from "../components/layout/CheckOut";
import ProductDetails from "../components/layout/ProductDetails";
function MainRoutes() {
  const location = useLocation();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {initialLoading ? (
        <Loader />
      ) : (
        <>
          <Navigation />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Landing />
                  </PageWrapper>
                }
              />
              <Route 
              path="/category"
              element={
                <PageWrapper>
                  <ProductListing />
                </PageWrapper>
              }
              />
              <Route
                path="/:category/:name"
                element={
                  <PageWrapper>
                    <ProductDetails />
                  </PageWrapper>
                }
              />
              <Route
                path="/category/:name"
                element={
                  <PageWrapper>
                    <ProductListing />
                  </PageWrapper>
                }
              />
              <Route
                path="/search"
                element={
                  <PageWrapper>
                    <SearchPage />
                  </PageWrapper>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageWrapper>
                      <WishList />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageWrapper>
                      <Cart />
                    </PageWrapper>
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PageWrapper>
                      <CheckOut />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute authOnly={true}>
                    <PageWrapper>
                      <Register />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <ProtectedRoute authOnly={true}>
                    <PageWrapper>
                      <Login />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PageWrapper>
                    <ForgotPassword />
                  </PageWrapper>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <PageWrapper>
                    <VerifyOTP />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
          <Footer />
        </>
      )}
    </div>
  );
}

export default MainRoutes;
