import axios, {AxiosInstance} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    Accept: 'application/json',
  },
});

const apiReq = (
  endPoint: string,
  data: any,
  method: string,
  headers = {},
  requestOptions = {},
): Promise<any> => {
  const rId: string = Math.floor(Math.random() * Date.now()).toString(8);

  headers = {
    ...headers,
    rId: rId,
  };

  return new Promise((resolve, reject) => {
    instance({
      method: method,
      url: endPoint,
      data: data,
      params: requestOptions,
      headers: headers,
    })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const apiPost = (
  endPoint: string,
  data: any,
  headers = {},
): Promise<any> => {
  return apiReq(endPoint, data, 'post', headers);
};

export const apiDelete = (endPoint: string, headers = {}): Promise<any> => {
  return apiReq(endPoint, null, 'delete', headers);
};

export const apiGet = (
  endPoint: string,
  headers = {},
  requestOptions = {},
): Promise<any> => {
  return apiReq(endPoint, null, 'get', headers, requestOptions);
};

export const apiPut = (
  endPoint: string,
  data: any,
  headers = {},
): Promise<any> => {
  return apiReq(endPoint, data, 'put', headers);
};
