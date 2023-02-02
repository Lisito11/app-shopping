import axios from "../../api/axios";
import authHeader from "../../auth/services/auth-header";


class ShoppingItemListService {

  async create(name, brand, shoppingListId, superMarketProductBrandId, quantity, price) {
    return axios
      .post("/shoppingdetaillist", {
        shoppingListId,
        superMarketProductBrandId,
        name,
        brand,
        quantity,
        price,
      }, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async update(name, brand, shoppingListId, superMarketProductBrandId, quantity, price, id) {
    return axios
      .put(`/shoppingdetaillist/${id}`, {
        shoppingListId,
        superMarketProductBrandId,
        name,
        brand,
        quantity,
        price,
      }, {headers: authHeader()})
      .then((response) => {        
        return response.status;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async getByShoppingList(shoppingId) {
    return axios
      .get(`/shoppingdetaillist/list/${shoppingId}`, {headers: authHeader()})
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }

  async delete(id) {
    return axios
      .delete(`/shoppingdetaillist/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {        
        return response.data;
      }).catch(({response}) => {
        return response.data;
      });
  }
}

export default new ShoppingItemListService();
