import { authInstance } from "./instance"


export const authHttp = {
  get: (url: string, params?: any, headers?: string, authToken?: string) =>{
    const finalHeaders = {
      'Content-Type': headers || 'application/json',
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    };
    return authInstance({
      method: 'GET',
      url,
      params: params || undefined,
      headers: finalHeaders,
      transformResponse: [data => JSON.parse(data)],
    })
  },
  post: (url: string, payload: any = {}, headers?: string) =>
    authInstance({
      method: 'POST',
      url,
      data: payload,
      headers: {
        'Content-Type': headers || 'application/json',
      },
      transformResponse: [data => JSON.parse(data)],
    }),
  put: (url: string, params: any = {}, headers?: string) => {
    return authInstance({
      method: 'PUT',
      url,
      headers: {
        'Content-Type': headers || 'application/json',
      },
      data: params,
      transformResponse: [data => JSON.parse(data)],
    });
  },
  patch: (url: string, params: any = {}, headers?: string) =>
    authInstance({
      method: 'PATCH',
      url,
      data: params,
      headers: {
        'Content-Type': headers || 'application/json',
      },
      transformResponse: [
        data => {
          try {
            return JSON.parse(data);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
          }
        },
      ],
    }),
  delete: (url: string, params: any = {}, headers?: string) =>
    authInstance({
      method: 'DELETE',
      url,
      data: params,
      headers: {
        'Content-Type': headers || 'application/json',
      },
      transformResponse: [data => JSON.parse(data)],
    }),
};
