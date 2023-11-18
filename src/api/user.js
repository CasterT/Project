import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
const serverURL = 'http://120.24.189.44:8080';
// import Cookies from 'js-cookie'

function createXMLHttpRequest() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  }
  if (window.ActiveXObject) {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
  return null;
}

function sendAjaxRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const xhr = createXMLHttpRequest();
    if (!xhr) {
      reject(new Error('XMLHttpRequest is not supported.'));
      return;
    }

    xhr.open(method, url, true);

    // Set headers
    if (store.getters.token) {
      xhr.setRequestHeader('X-Token', getToken());
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          const error = new Error(xhr.statusText);
          error.response = xhr;
          reject(error);
        }
      }
    };

    xhr.onerror = function () {
      const error = new Error('Network error');
      error.response = xhr;
      reject(error);
    };

    if (method === 'GET') {
      xhr.send();
    } else {
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.send(JSON.stringify(data));
    }
  });
}

// request interceptor
const request = {
  get(url, data) {
    return sendAjaxRequest(url, 'GET', data);
  },
  post(url, data) {
    return sendAjaxRequest(url, 'POST', data);
  },
  put(url, data) {
    return sendAjaxRequest(url, 'PUT', data);
  },
  delete(url, data) {
    return sendAjaxRequest(url, 'DELETE', data);
  },
};

// response interceptor
const response = {
  handleSuccess(res) {
    if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      });

      if (res.code === 508 || res.code === 512 || res.code === 514) {
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      }

      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  handleError(error) {
    console.log('err' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  },
};

export default {
  get(url, data) {
    return request.get(url, data)
      .then(response.handleSuccess)
      .catch(response.handleError);
  },
  post(url, data) {
    return request.post(url, data)
      .then(response.handleSuccess)
      .catch(response.handleError);
  },
  put(url, data) {
    return request.put(url, data)
      .then(response.handleSuccess)
      .catch(response.handleError);
  },
  delete(url, data) {
    return request.delete(url, data)
      .then(response.handleSuccess)
      .catch(response.handleError);
  },
};

export function login(data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", serverURL+"/system/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error("Login request failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Login request failed"));
    };

    xhr.send(JSON.stringify(data));
  });
}

export function getInfo(token) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", serverURL+"/system/user/info", true);

    // xhr.setRequestHeader("Cookie", `token=${token}`);

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error("GetInfo request failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("GetInfo request failed"));
    };

    xhr.send();
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", serverURL+"/system/user/logout", true);

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error("Logout request failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Logout request failed"));
    };

    xhr.send();
  });
}

// const serverURL = 'http://120.24.189.44:8080';
// // request interceptor
// const request = {
//   get(url, data) {
//     return sendAjaxRequest(serverURL + url, 'GET', data);
//   },
//   post(url, data) {
//     return sendAjaxRequest(serverURL + url, 'POST', data);
//   },
//   put(url, data) {
//     return sendAjaxRequest(serverURL + url, 'PUT', data);
//   },
//   delete(url, data) {
//     return sendAjaxRequest(serverURL + url, 'DELETE', data);
//   },
// };

// export function login(data) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", serverURL + "/system/user/login", true);
//     xhr.setRequestHeader("Content-Type", "application/json");

//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         const response = JSON.parse(xhr.responseText);
//         resolve(response);
//       } else {
//         reject(new Error("Login request failed"));
//       }
//     };

//     xhr.onerror = function () {
//       reject(new Error("Login request failed"));
//     };

//     xhr.send(JSON.stringify(data));
//   });
// }
// export function getInfo(token) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("GET", /*serverURL +*/"/system/user/info", true);

//     xhr.setRequestHeader("Cookie", `token=${token}`);

//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         const response = JSON.parse(xhr.responseText);
//         resolve(response);
//       } else {
//         reject(new Error("GetInfo request failed"));
//       }
//     };

//     xhr.onerror = function () {
//       reject(new Error("GetInfo request failed"));
//     };

//     xhr.send();
//   });
// }

// export function logout() {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", serverURL + "/system/user/logout", true);

//     xhr.onload = function () {
//       if (xhr.status === 200) {
//         resolve();
//       } else {
//         reject(new Error("Logout request failed"));
//       }
//     };

//     xhr.onerror = function () {
//       reject(new Error("Logout request failed"));
//     };

//     xhr.send();
//   });
// }
