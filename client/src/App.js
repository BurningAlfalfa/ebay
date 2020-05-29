import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const optionArray = [
  { value: "sedan", text: "Sedan" },
  { value: "suv", text: "Suv" },
  { value: "truck", text: "Truck" },
  { value: "hatch", text: "Hatchback" },
  { value: "sportsCar", text: "SportsCar" },
];

function App() {
  const [inputValue, setInputValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  console.log(items);
  const [selectValue, setSelectValue] = useState(optionArray[0].value);
  const [filterType, setFilterType] = useState(optionArray[0].value);
  const [searchValue, setSearchValue] = useState("");
  console.log(items.filter((item) => item.type === filterType));
  console.log(selectValue);

  //use state, the first hing is the variable the second is the function to change the varible value
  useEffect(() => {
    //this refresehs the frontend initally and
    fetch("/items") //loads everthing in the dataebase to the front end
      .then((res) => res.json())
      .then((res) => setItems(res));
    fetch("purchasedItems")
      .then((res) => res.json())
      .then((res) => setPurchasedItems(res));
    // .then(console.log);
  }, []);
  function onChangeDescription(evt) {
    const value = evt.target.value;
    setDescriptionValue(value);
  }
  function onChangeOption(evt) {
    const value = evt.target.value;
    console.log(value);
    setSelectValue(value);
  }
  function onChangeFilter(evt) {
    const filterType = evt.target.value;
    console.log("works");
    setFilterType(filterType);
  }
  function onChangeSearch(evt) {
    const value = evt.target.value;
    setSearchValue(value);
  }

  function onChangeInput(evt) {
    const value = evt.target.value;
    setInputValue(value);
  }
  function onClickAdd() {
    console.log(inputValue);
    fetch("/add-item", {
      method: "POST",
      body: JSON.stringify({ inputValue, selectValue, descriptionValue }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      fetch("/items")
        .then((res) => res.json())
        .then((res) => setItems(res));
    });
  }
  function searchResults() {
    const filteredItems = {};
    const searchResultsArray = [];
    items.forEach((item) => {
      console.log(filteredItems);
      const shouldAddItem =
        item.text.toLowerCase().indexOf(searchValue) >= 0 ||
        item.type.toLowerCase().indexOf(searchValue) >= 0 ||
        (item.description.toLowerCase().indexOf(searchValue) >= 0 &&
          !filteredItems[item._id]);
      if (shouldAddItem === true) {
        searchResultsArray.push(item);
        filteredItems[item._id] = item;
      }
    });
    console.log(searchResultsArray);
    return searchResultsArray;
  }
  function onClickBuy(index) {
    const item = items[index];
    fetch("/buy-item", {
      method: "POST",
      body: JSON.stringify(item),

      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      fetch("/items")
        .then((res) => res.json())
        .then((res) => setItems(res));
      fetch("/purchasedItems")
        .then((res) => res.json())
        .then((res) => setPurchasedItems(res));
    });
  }
  //use state, the first hing is the variable the second is the function to change the varible value
  console.log(items, searchValue);
  return (
    <Router>
      <div>Search here</div>
      <input onChange={onChangeSearch} value={searchValue} />
      <div className="sell-item-container">
        <div> Enter the car you would like to sell</div>
        <input className="search" onChange={onChangeInput} value={inputValue} />
        <div className="sell-item-description">
          <div className="sell-description">
            Write a brief description of the product you are tryign to sell
          </div>
          <textarea
            className="description"
            onChange={onChangeDescription}
            value={descriptionValue}
          />
        </div>
        <label>Chose a car type you would like to sell:</label>
        {/* <select onChange={onChangeOption} value={selectValue}>
        <option value="sedan">Sedan</option>
        <option value="suv">Suv</option>
        <option value="truck">Truck</option>
        <option value="dick">THIS DICK</option>
        <option value="sportsCar">Sports Car</option>
      </select> */}

        <select onChange={onChangeOption} value={selectValue}>
          {optionArray.map((option, index) => {
            /*
        array of objects
        {value:sedan,text:Sedan}
        */

            return <option value={option.value}>{option.text}</option>;
          })}
        </select>

        <button className="button" onClick={onClickAdd}>
          Sell
        </button>
      </div>

      <div>
        <div className="buy-container">
          {"Search results"}
          {searchResults().map((item, index) => {
            return (
              <div className="buy-item-description-button">
                <div>
                  <div>{"Title:" + item.text}</div>
                  <div>{"Description: " + item.description}</div>
                  <div>{"Type: " + item.type}</div>
                </div>
                <button className="button" onClick={() => onClickBuy(index)}>
                  Buy
                </button>
              </div>
            );
          })}
          {/* {items
          .filter((item) => item.text.toLowerCase().indexOf(searchValue) >= 0)
          .filter((item) => item.type.toLowerCase().indexOf(searchValue) >= 0)
          .filter(
            (item) => item.description.toLowerCase().indexOf(searchValue) >= 0
          )
          .map((item, index) => {
            return (
              <div className="search-item">
                <div> {item.text} </div>
                <button className="button" onClick={() => onClickBuy(index)}>
                  Buy
                </button>
              </div>
            );
          })} */}
        </div>
      </div>
      <div className="buy-container">
        {"Chose what you would like to buy "}
        {items
          .filter((item) => item.type === filterType)

          .map((item, index) => {
            return (
              <div className="buy-item-description-button">
                <div className="item-header">
                  <div className="">{item.text}</div>
                  <div>{item.description}</div>
                </div>
                <button className="button" onClick={() => onClickBuy(index)}>
                  Buy
                </button>
              </div>
            );
          })}

        <div> Filter the buying results here</div>

        <select onChange={onChangeFilter} value={filterType}>
          {optionArray.map((option, index) => {
            /*
        array of objects
        {value:sedan,text:Sedan}
        */

            return <option value={option.value}>{option.text}</option>;
          })}
        </select>
      </div>
      <div>List of items that have been bought </div>
      {purchasedItems.map((purchasedItem) => {
        return (
          <div>
            <div>{purchasedItem.text}</div>
            <div>{purchasedItem.description}</div>
          </div>
        );
      })}
    </Router>
  );
}
//refresh doesnt save the previous seach values
export default App;
