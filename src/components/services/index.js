import axios from "axios";
// const url = process.env.API_URL_REACT;

export const adminLogin = async (payload) => {
    try {
        const response = await axios?.post( //put
            `http://localhost:8000/api/admin-login`,
            payload,//object
            {
                headers: {
                    "Content-Type": "application/json", ///multipart/form-data
                  //  Authorization: `Bearer ${tocken}`
                }
            }

        )
        // alert(url)
        return response.data;

    } catch (err) {
        console.log(err);
    }
} 
export const userRegister = async (payload) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  } 
  export const userLogin = async (payload) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user-login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  } 
  export const addToCartUser = async (payload) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/add-to-cart`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  } 
export const adminAddProduct = async (payload) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/add-product`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure multipart/form-data is set
        }
      }
    );
    return response.data; 
  } catch (err) {
    console.error('Error adding product:', err);
    throw err;
  }
}; 
  export const adminGetProduct = async (payload) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/add-product`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  }

  export const getSingleUserCart = async (payload) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/add-to-cart/${payload}`, 
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  }

  export const userCartDelete= async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/add-to-cart/${id}`,
         {
        headers: {
          "Content-Type": "application/json", 
        }
      });
      return response.data; 
    } catch (err) {
      console.log("Error deleting product: ", err);
      throw err; 
    }
  };
  
  
  export const adminDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/add-product/${id}`,
         {
        headers: {
          "Content-Type": "application/json", 
        }
      });
      return response.data; 
    } catch (err) {
      console.log("Error deleting product: ", err);
      throw err; 
    }
  };
  

  export const adminEditProduct = async (id,payload) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/add-product/${id}`,payload,
         {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      return response.data; 
    } catch (err) {
      console.log("Error deleting product: ", err);
      throw err; 
    }
  };

  
  export const createOrder = async (payload) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api//order`,
        payload,
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  } 
 
export const  GetUserOrder = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/order/${userId}`, 
      {
        headers: {
          "Content-Type": "application/json", 
        }
      }
    );
    return response.data; 
  } catch (err) {
    console.log(err);
  }
}
  export const adminGetOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/order`, 
        {
          headers: {
            "Content-Type": "application/json", 
          }
        }
      );
      return response.data; 
    } catch (err) {
      console.log(err);
    }
  }