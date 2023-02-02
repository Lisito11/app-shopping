import axios from "../../api/axios";
import authHeader from "../../auth/services/auth-header";


class ShoppingListService {

  async create(supermarketId, userId, dateCreated) {
    return axios
      .post("/shoppinglist", {
        supermarketId,
        userId,
        created: dateCreated,
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async update(supermarketId, userId, dateCreated, id) {
    return axios
      .put(`/shoppinglist${id}`, {
        supermarketId,
        userId,
        dateCreated
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getAllByUser(userId) {
    return axios
      .get(`/shoppinglist/user/${userId}`, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async delete(id) {
    return axios
      .delete(`/shoppinglist/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }
}

export default new ShoppingListService();
