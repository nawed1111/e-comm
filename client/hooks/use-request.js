import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [error, seterror] = useState(null);

  const doRequest = async () => {
    try {
      seterror(null);
      const response = await axios({ method, url, data: body });

      if (onSuccess) onSuccess(response.data);
      return response;
    } catch (error) {
      seterror(
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
