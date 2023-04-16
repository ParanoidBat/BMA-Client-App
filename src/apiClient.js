const axios = require("axios");
const { Storage } = require("@capacitor/storage");

const parseAxiosError = (err) => {
  if (err.response?.data?.error && err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err.response?.data) {
    // ignore errors containing html view
    if (!err.response.headers["content-type"].startsWith("text/html")) {
      return err.response.data;
    }
  }
  return err.message;
};

const apiClient = async (url, method, req_data) => {
  let data;
  let error = null;
  let status;
  try {
    const token = await Storage.get({ key: "Token" });

    const resp = await axios({
      url,
      method,
      data: req_data,
      headers: { "x-access-token": token.value },
    });

    data = resp.data;
    status = resp.status;
  } catch (err) {
    console.error(err);
    error = parseAxiosError(err);
    status = err.response?.status || 400;
  }

  return { data, error, status };
};

apiClient.get = (url, data) => {
  return apiClient(url, "GET", data);
};
apiClient.post = (url, data) => {
  return apiClient(url, "POST", data);
};
apiClient.put = (url, data) => {
  return apiClient(url, "PUT", data);
};
apiClient.delete = (url, data) => {
  return apiClient(url, "DELETE", data);
};

export default apiClient;
