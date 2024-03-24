"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RestaurantMenu = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [products, setProducts] = useState({});
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [currentCategoryType, setCurrentCategoryType] = useState("veg");
  const [currentAvailability, setCurrentAvailability] = useState("quantity");
  const [isEditing, setIsEditing] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);

  const handleCategoryChange = (e) => {
    setCurrentCategory(e.target.value);
  };

  const handleProductChange = (e) => {
    setCurrentProduct(e.target.value);
  };

  const handlePriceChange = (e) => {
    setCurrentPrice(e.target.value);
  };

  const handleCategoryTypeChange = (e) => {
    setCurrentCategoryType(e.target.value);
  };

  const handleAvailabilityChange = (e) => {
    setCurrentAvailability(e.target.value);
  };

  const handleAddCategory = () => {
    if (currentCategory) {
      setCategories([...categories, currentCategory]);
      setCurrentCategory("");
    }
  };

  const handleAddProduct = (category) => {
    if (currentProduct && currentPrice && currentCategoryType) {
      const newProduct = {
        name: currentProduct,
        price: currentPrice,
        categoryType: currentCategoryType,
        availability: currentAvailability,
      };

      if (isEditing && editProductIndex !== null) {
        const updatedProducts = [...(products[category] || [])];
        updatedProducts[editProductIndex] = newProduct;

        setProducts({
          ...products,
          [category]: updatedProducts,
        });

        setIsEditing(false);
        setEditProductIndex(null);
      } else {
        setProducts({
          ...products,
          [category]: [...(products[category] || []), newProduct],
        });
      }

      setCurrentProduct("");
      setCurrentPrice("");
      setCurrentCategoryType("veg");
      setCurrentAvailability("unlimited");
    }
  };

  const handleEditProduct = (categoryIndex, productIndex) => {
    const product = products[categories[categoryIndex]][productIndex];
    setCurrentProduct(product.name);
    setCurrentPrice(product.price);
    setCurrentCategoryType(product.categoryType);
    setCurrentAvailability(product.availability);
    setIsEditing(true);
    setEditProductIndex(productIndex);
  };

  const handleDeleteProduct = (categoryIndex, productIndex) => {
    const category = categories[categoryIndex];
    const updatedProducts = [...(products[category] || [])];
    updatedProducts.splice(productIndex, 1);

    setProducts({
      ...products,
      [category]: updatedProducts,
    });
  };

  const handleSaveClick = async () => {
    try {
      const vendorResponse = await fetch("/api/vendor/me", {
        cache: "no-cache",
      });
      const data = await vendorResponse.json();
      const vendorToken = data.decoded;
      const number = vendorToken.number;

      const response = await axios.put(`/api/vendor/update/menu`, {
        number,
        menu: products,
      });

      const json = await response.data;

      if (json.success) {
        toast.success(json.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(json.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("An error occured : " + error);
    }
  };

  useEffect(() => {
    const fetchMenu = async () => {
      const vendorResponse = await fetch("/api/vendor/me", {
        cache: "no-cache",
      });
      const data = await vendorResponse.json();
      const vendorToken = data.decoded;
      const number = vendorToken.number;
      try {
        const response = await axios.post(`/api/vendor/fetchmenu`, { number });
        const json = response.data;

        if (json.success) {
          setCategories(Object.keys(json.menu)); // Extract categories
          setProducts(json.menu);
        } else {
          // Handle error
          console.error("Failed to fetch menu:", json.message);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="mx-auto p-4 md:w-1/2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Menu</h1>
        <Button onClick={handleSaveClick}>Save</Button>
      </div>

      <div className="flex flex-row gap-2 mt-3">
        <Input
          type="text"
          placeholder="Add Category"
          value={currentCategory}
          onChange={handleCategoryChange}
        />
        <Button onClick={handleAddCategory} variant="secondary">
          +
        </Button>
      </div>

      <div className="mt-4">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-4 border p-2 rounded-md">
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="flex flex-col sm:flex-row mt-2 justify-between gap-2 border p-2 rounded-md">
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Product Name"
                  value={currentProduct}
                  onChange={handleProductChange}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={currentPrice}
                  onChange={handlePriceChange}
                />
              </div>

              <select
                value={currentCategoryType}
                onChange={handleCategoryTypeChange}
                className="w-full sm:w-1/4 p-2 mb-2 sm:mr-2 rounded-md border h-fit"
              >
                <option value="veg">veg</option>
                <option value="nonveg">nonveg</option>
              </select>
              <div className="flex flex-col">
                <label className="mr-2">
                  <input
                    type="radio"
                    value="unlimited"
                    checked={currentAvailability === "unlimited"}
                    onChange={() => setCurrentAvailability("unlimited")}
                  />{" "}
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    value="over"
                    checked={currentAvailability === "over"}
                    onChange={() => setCurrentAvailability("over")}
                  />{" "}
                  Over
                </label>
              </div>
              <button
                onClick={() => handleAddProduct(category)}
                className={`mt-2 md:mt-0 w-full h-fit sm:w-auto px-4 py-2 ${
                  isEditing ? "bg-yellow-500" : "bg-green-500"
                } text-white rounded-md`}
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
            </div>
            <ul className="mt-2">
              {products[category] &&
                products[category].map((product, productIndex) => (
                  <li
                    key={productIndex}
                    className="mb-2 border p-3 flex justify-between items-center"
                  >
                    <span>
                      {product.name} - {product.price} - {product.categoryType}{" "}
                      - {product.availability}
                    </span>
                    <div>
                      <button
                        onClick={() =>
                          handleEditProduct(categoryIndex, productIndex)
                        }
                        className="ml-1 text-white bg-yellow-400 py-1 px-2 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(categoryIndex, productIndex)
                        }
                        className="ml-1 text-white bg-red-600 p-1 rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
