const users = require('./controller/user');
const product = require('./controller/product');
const chat = require('./controller/chat');

let routes = {
  users: async(method, payload) => {
    let result = await users[method](payload);
    return result;
  },

  product: async(method, payload) =>{ 
    let result = await product[method](payload);
    return result;
  },

  chat: async(method, payload) =>{ 
    let result = await chat[method](payload);
    return result;
  }
    
};

module.exports = routes;
