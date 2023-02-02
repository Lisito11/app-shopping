import axios from "../../api/axios";
import authHeader from "../../auth/services/auth-header";


class BrandService {

  async create(name, description) {
    return axios
      .post("/brand", {
        name,
        description,
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async update(name, description, id) {
    return axios
      .put(`/brand/${id}`, {
        name,
        description,
      },{headers: authHeader()})
      .then((response) => {        
        return response.status;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getAll() {
    return axios
      .get("/brand", {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }


  async delete(id) {
    return axios
      .delete(`/brand/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }
}

export default new BrandService();
