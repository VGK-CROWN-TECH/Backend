const { isEmpty } = require("../public/validation");
const { success, error, missingParam, created } = require("../public/response");
const Product = require("../model/product");

let products = {
  createProduct: async (payload) => {
    let reqFields = isEmpty(payload, ["name", "amount", "description"]);
    if (reqFields.length > 0) {
      return missingParam(reqFields);
    }

    try {
      const newProduct = new Product({
        name: payload.name,
        amount: payload.amount,
        description: payload.description || ""
      });

      const result = await newProduct.save();

      return created("Product created successfully", {
        id: result._id,
        name: result.name,
        amount: result.amount,
        description: result.description,
      });
    } catch (err) {
      console.error("Create Product Error:", err);
      return error(500, "Internal server error");
    }
  },

  updateProduct: async (payload) => {
    const reqFields = isEmpty(payload, ["id"]);
    if (reqFields.length > 0) {
      return missingParam(reqFields);
    }

    try {
      const product = await Product.findById(payload.id);
      if (!product) {
        return error(404, "Product not found");
      }

      if (payload.name !== undefined) product.name = payload.name;
      if (payload.amount !== undefined) product.amount = payload.amount;
      if (payload.description !== undefined) product.description = payload.description;

      const updatedProduct = await product.save();

      return success("Product updated successfully", updatedProduct);
    } catch (err) {
      console.error("Update Product Error:", err);
      return error(500, "Internal server error");
    }
  },

  fetchProducts: async () => {
    try {
      const products = await Product.find({});
      return success("All products fetched successfully", products);
    } catch (err) {
      console.error("Fetch Product Error:", err);
      return error(500, "Internal server error");
    }
  },
};

module.exports = products;
