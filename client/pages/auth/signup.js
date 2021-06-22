import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const Signup = () => {
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const { doRequest, error } = useRequest({
    url: '/api/users/signup',
    method: 'POST',
    body: {
      fname,
      lname,
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  const onClick_Signin = () => {
    Router.push('/auth/signin');
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h1>Sign up</h1>
        <div className="form-group">
          <label>First Name</label>
          <input
            value={fname}
            onChange={(e) => setfname(e.target.value)}
            className="form-control"
          />
          <label>Last Name</label>
          <input
            value={lname}
            onChange={(e) => setlname(e.target.value)}
            className="form-control"
          />
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
          Sign Up
        </button>
      </form>
      <br />
      <h6>Already have an account? Please</h6>
      <button onClick={onClick_Signin} className="btn btn-primary">
        Sign In
      </button>
    </>
  );
};

export default Signup;
