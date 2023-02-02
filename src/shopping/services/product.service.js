import axios from "../../api/axios";
import authHeader from "../../auth/services/auth-header";


class ProductService {

  async create(name, description) {
    return axios
      .post("/product", {
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
      .put(`/product/${id}`, {
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
      .get("/product", {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async delete(id) {
    return axios
      .delete(`/product/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getAllProductBrands() {
    return axios
      .get("/productbrand", {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async addProducBrand(productId, brandId) {
    console.log(productId, brandId);
    return axios
      .post("/productbrand", {
        productId,
        brandId,
      }, {headers: authHeader()})
      .then((response) => {    
        console.log(response);
        return response.data;
      }).catch(({response}) => {
        console.log(response);
        return response.data;
      });
  }
}

export default new ProductService();
