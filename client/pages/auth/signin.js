import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const SignIn = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const { doRequest, error } = useRequest({
    url: '/api/users/signin',
    method: 'POST',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  const onClick_Signup = () => {
    Router.push('/auth/signup');
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="form-control"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="form-control"
          />
        </div>
        <br />
        {error}
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </form>
      <br />
      <h6>New user? Please</h6>
      <button onClick={onClick_Signup} className="btn btn-primary">
        Sign Up
      </button>
    </>
  );
};

export default SignIn;
