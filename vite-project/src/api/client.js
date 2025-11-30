import api from "./axiosInstancs";

const handleRequest = async (requestFn) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await requestFn();
    return response;
  } catch (err) {
    throw err;
  }
};

const apiClient = {
  get: (url, config = {}) =>
    handleRequest(() => api.get(url, config)),

  post: (url, data, config = {}) =>
    handleRequest(() => api.post(url, data, config)),

  put: (url, data, config = {}) =>
    handleRequest(() => api.put(url, data, config)),

  patch: (url, data, config = {}) =>
    handleRequest(() => api.patch(url, data, config)),

  delete: (url, config = {}) =>
    handleRequest(() => api.delete(url, config)),
};

export default apiClient;