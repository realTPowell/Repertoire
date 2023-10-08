const API_ROOT = "http://127.0.0.1:5000/api";

const encode = encodeURIComponent;

export default function createAgent([state, actions]) {
  async function send(method: String, url: String, data?: JSON, resKey?: String) {
    const headers = {},
      opts = { method, headers };

    if (data !== undefined) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(data);
    }

    // if (state.token) headers["Authorization"] = `Token ${state.token}`;

    try {
      const response = await fetch(API_ROOT + url, opts);
      const json = await response.json();
      const result = resKey ? json[resKey] : json
      return result;
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        actions.logout();
      }
      return err;
    }
  }

  // TODO: none of this works yet, create DB structure and API routes to do this
  const Auth = {
    current: () => send("get", "/user", undefined, "user"),
    login: (email, password) => send("post", "/users/login", { user: { email, password } }),
    register: (username, email, password) =>
      send("post", "/users", { user: { username, email, password } }),
    save: user => send("put", "/user", { user })
  };


  return {
    Auth
  };
}