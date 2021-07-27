import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [error, setError] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setError(null);
      const response = await axios({
        method,
        url,
        data: { ...body, ...props },
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      setError(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          {error.response ? error.response.data.error.message : 'Unknown Error'}
        </div>
      );
    }
  };

  return { doRequest, error };
};

export default useRequest;
