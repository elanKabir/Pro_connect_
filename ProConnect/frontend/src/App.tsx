// App.tsx
import React from 'react';
import Login from './pages/Login';

import Register from './pages/Register';
import ChangePassword from './pages/PasswordChange';
import { Routes, Route } from 'react-router-dom';
import AdminViewAllUsers from './pages/admin/AdminViewAllUsers';
import ErrorPage from './pages/ErrorPage';
import GuestRoute from './hooks/GuestRoute';
import EditProfile from './pages/ProfilePage';
import EditProfilePage from './components/EditProfile/EditProfilePage';
import EditUserProfile from './pages/EditUserProfile';
import EditDeleteProject from './pages/EditDeleteProject';
import UserProfilePage from './pages/UserProfilePage';
import Profile from './pages/Profile';
import AllReviews from './pages/AllReviews';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectListingPage from './pages/projects/ProjectListingPage';
import ProjectRemoveApproved from './pages/ProjectRemoveApproved';
import ProjectView from './pages/ProjectView';
import ProjectApply from './pages/ProjectApply';
import CreateProject from './pages/CreateProject';
import ViewApplicant from './pages/ViewApplicant';

import jwt from 'jwt-decode';
import UserProjectPage from './pages/UserProjectPage';
import ProjectApplicationList from './pages/ProjectApplicationList';
import CreateReview from './pages/CreateReview';
import AdminViewAllProject from './pages/admin/AdminViewAllProject';
import ProfessionalPage from './pages/ProfessionalPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Certificate from './components/Certificate/Certificate';
import CertificateListingPage from './pages/CertificateListingPage';
import ProfessionalApplicationsPage from './pages/ProfessionalApplicationsPage';
import Reviews from './pages/Reviews';
import SingleReviewPage from './pages/SingleReview';

function App() {
  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem('token')
  );

  const setTokenHandler = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token!);
    } else {
      localStorage.removeItem('token');
    }

    setToken(token);
  };

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    } else {
      setToken(null);
    }
  }, [token]);

  return (
    <>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route
            path="/signup"
            element={<Register setTokenHandler={setTokenHandler} />}
          />
          <Route
            path="/signin"
            element={<Login setTokenHandler={setTokenHandler} />}
          />
        </Route>

        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/all_reviews" element={<AllReviews />} />

        <Route path="/edit_profile" element={<EditProfile />} />
        <Route path="/view_all_reviews" element={<AllReviews />} />

        <Route
          path="/modify_delete_project"
          element={
            <EditDeleteProject
              setTokenHandler={function (token: string | null): void {
                throw new Error('Function not implemented.');
              }}
              token={null}
            />
          }
        />

        <Route
          path="/remove_approved_pro"
          element={
            <ProjectRemoveApproved
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="/profile/:uid"
          element={<Profile setTokenHandler={setTokenHandler} token={token} />}
        />
        <Route
          path="/profile/:uid/edit_profile"
          element={
            <EditUserProfile setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route
          path="/project/:project_id/edit_project"
          element={
            <EditDeleteProject
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="test/profile"
          element={<UserProfilePage setToken={setToken} token={token} />}
        />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route
          path="/"
          // element={<Home setTokenHandler={setTokenHandler} token={token} />}
          element={
            <ProjectListingPage
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="/project/:project_id"
          element={
            <ProjectView setTokenHandler={setTokenHandler} token={token} />
          }
        />
        <Route
          path="/project/:project_id/apply"
          element={
            <ProjectApply setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route
          path="/project/:project_id/applicants"
          element={
            <ProjectApplicationList
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="/applications"
          element={
            <ProfessionalApplicationsPage
              token={token}
              setTokenHandler={setTokenHandler}
            />
          }
        />

        <Route
          path="/project/create"
          element={
            <CreateProject setTokenHandler={setTokenHandler} token={token} />
          }
        />
        <Route
          path="/project/:project_id/applicants/:user_id"
          element={
            <ViewApplicant setTokenHandler={setTokenHandler} token={token} />
          }
        />
        <Route
          path="/projects"
          element={
            <ProjectListingPage
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="/professionals"
          element={
            <ProfessionalPage setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route
          path="/profile/:uid/projects"
          element={
            <UserProjectPage setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route
          path="/admin/view_users"
          element={
            <AdminViewAllUsers
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />
        <Route
          path="/reviews/:uid"
          element={<Reviews setTokenHandler={setToken} token={token} />}
        />

        <Route
          path="/create_review/:project_id/:uid"
          element={
            <CreateReview setTokenHandler={setTokenHandler} token={token} />
          }
        />
        <Route
          path="/admin/view_projects"
          element={
            <AdminViewAllProject
              setTokenHandler={setTokenHandler}
              token={token}
            />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route
          path="/certificates"
          element={
            <CertificateListingPage
              token={token}
              setTokenHandler={setTokenHandler}
            />
          }
        />

        <Route
          path="/single_review/:uid/:review_id"
          element={
            <SingleReviewPage setTokenHandler={setTokenHandler} token={token} />
          }
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
