import React from 'react';
import useRequest from '../hooks/use-request';
import Router from 'next/router';

import buildClient from '../api/build-client';

const LandingPage = ({ user }) => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    onSuccess: () => Router.push('/'),
  });

  const onClick_Signout = async () => {
    await doRequest();
  };

  const onClick_Signin = () => {
    Router.push('/auth/signin');
  };

  return user ? (
    <div>
      <h1>You are signed in</h1>
      <button className="btn btn-primary" onClick={onClick_Signout}>
        Signout
      </button>
    </div>
  ) : (
    <div>
      <h1>You are not signed in</h1>
      <button className="btn btn-primary" onClick={onClick_Signin}>
        Signin
      </button>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  try {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentUser');
    return data;
  } catch (error) {
    return error.response.data.error;
  }
};

export default LandingPage;
