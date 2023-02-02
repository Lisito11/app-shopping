import axios from "../../api/axios";
import authHeader from "../../auth/services/auth-header";


class SuperMarketService {

  async create(name, slogan, description) {
    return axios
      .post("/supermarket", {
        name,
        description,
        slogan
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async update(name, slogan, description, id) {
    return axios
      .put(`/supermarket/${id}`, {
        name,
        description,
        slogan,
      },{headers: authHeader()})
      .then((response) => {        
        return response.status;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getAll() {
    return axios
      .get("/supermarket", {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async delete(id) {
    return axios
      .delete(`/supermarket/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async addProductSupermarket(superMarketId, productBrandId, price) {
    return axios
      .post("/supermarketproductbrand", {
        superMarketId,
        productBrandId,
        price
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getProductsBySupermarket(superMarketId) {
    return axios
      .get(`/supermarketproductbrand/supermarket/${superMarketId}`, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async deleteProductSupermarket(id) {
    return axios
      .delete(`/supermarketproductbrand/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.status;
      }).catch(({response}) => {
        return response.data;
      });
  }


}

export default new SuperMarketService();
