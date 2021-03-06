import React, { useState } from "react";

import Button from "../../Button/Button";
import Input from "../../Input/Input";
import "./newProduct.css";

const NewProduct = (props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredPrice, setEnteredPrice] = useState("");

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const priceChangeHandler = (event) => {
    setEnteredPrice(event.target.value);
  };

  const submitProductHandler = (event) => {
    event.preventDefault();
    props.onAddProduct(enteredTitle, enteredPrice);
    setEnteredPrice("");
    setEnteredTitle("");
  };

  return (
    <section id="new-product">
      <h2>Add a New Product</h2>
      <form onSubmit={submitProductHandler}>
        <Input
          type="text"
          label="Title"
          id="title"
          placeholder="Enter Product Name"
          value={enteredTitle}
          onChange={titleChangeHandler}
        />
        <Input
          type="number"
          label="Price"
          step={0.01}
          id="price"
          placeholder={"Enter Product Price"}
          value={enteredPrice}
          onChange={priceChangeHandler}
        />
        <Button type="submit">ADD PRODUCT</Button>
      </form>
    </section>
  );
};

export default NewProduct;
