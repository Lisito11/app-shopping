import axios from "../../api/axios";

const ROLE_USER = "75f573a5-a0c1-4438-549a-08daffbd1080";

class AuthService {


  async login(email, password) {
    return axios
      .post("auth/login", {
        email,
        password
      })
      .then((response) => {
        const {data} = response.data;
        if (data.token) {
          localStorage.setItem("user", JSON.stringify(data));
        }
        return response.data;
      }).catch(({response}) => {
          return response.data;
      });
  }



  logout() {
    localStorage.removeItem("user");
  }

  async register(name, lastName, email, password) {
    return axios.post('/user', {
      name,
      lastName,
      email,
      password,
      roleId: ROLE_USER
    }).then((response) => {
       return response.data;
    }).catch(({response}) => {
       return response.data;
  });;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }

  isAuth() {
    return localStorage.getItem('user') ? true : false;
  }
}

// return axios.get(API_URL + 'user', { headers: authHeader() });


export default new AuthService();
