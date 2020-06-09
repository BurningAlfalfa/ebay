import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
const optionArray = [
  { value: "sedan", text: "Sedan" },
  { value: "suv", text: "Suv" },
  { value: "truck", text: "Truck" },
  { value: "hatch", text: "Hatchback" },
  { value: "sportsCar", text: "SportsCar" },
];

function App() {
  const [items, setItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
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

  function onClickSell(inputValue, selectValue, descriptionValue) {
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
  return (
    <>
      <Router>
        <Switch>
          <Route
            render={() => <SellPage onClickSell={onClickSell} />}
            path="/sell"
          />
          <Route
            render={() => (
              <BuyPage
                purchasedItems={purchasedItems}
                items={items}
                onClickBuy={onClickBuy}
              />
            )}
            path="/"
          ></Route>
        </Switch>
      </Router>
    </>
  );
}
//refresh doesnt save the previous seach values
export default App;
const BuyPage = (props) => {
  const [filterType, setFilterType] = useState(optionArray[0].value);
  const [searchValue, setSearchValue] = useState("");
  function onChangeFilter(evt) {
    const filterType = evt.target.value;
    console.log("works");
    setFilterType(filterType);
  }
  function onChangeSearch(evt) {
    const value = evt.target.value;
    setSearchValue(value);
  }

  function searchResults() {
    const filteredItems = {};
    const searchResultsArray = [];
    props.items.forEach((item) => {
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
  return (
    <>
      <div>
        <div>Search here</div>
        <input onChange={onChangeSearch} value={searchValue} />
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
                <button
                  className="button"
                  onClick={() => props.onClickBuy(index)}
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="buy-container">
        {"Chose what you would like to buy "}
        {props.items
          .filter((item) => item.type === filterType)

          .map((item, index) => {
            return (
              <div className="buy-item-description-button">
                <div className="item-header">
                  <div className="">{item.text}</div>
                  <div>{item.description}</div>
                </div>
                <button
                  className="button"
                  onClick={() => props.onClickBuy(index)}
                >
                  Buy
                </button>
              </div>
            );
          })}

        <div> Filter the buying results here</div>

        <select onChange={onChangeFilter} value={filterType}>
          {optionArray.map((option, index) => {
            return <option value={option.value}>{option.text}</option>;
          })}
        </select>
      </div>
      <div>List of items that have been bought </div>
      {props.purchasedItems.map((purchasedItem) => {
        return (
          <div>
            <div>{purchasedItem.text}</div>
            <div>{purchasedItem.description}</div>
          </div>
        );
      })}
    </>
  );
};
const SellPage = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState(optionArray[0].value);
  const [descriptionValue, setDescriptionValue] = useState("");
  const history = useHistory();
  const onClickHomePage = () => {
    history.push("/");
  };
  function onChangeDescription(evt) {
    const value = evt.target.value;
    setDescriptionValue(value);
  }
  function onChangeOption(evt) {
    const value = evt.target.value;
    console.log(value);
    setSelectValue(value);
  }
  function onChangeInput(evt) {
    const value = evt.target.value;
    setInputValue(value);
  }
  return (
    <>
      <button className="button" onClick={onClickHomePage}>
        Click here to return to Home
      </button>
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

        <select onChange={onChangeOption} value={selectValue}>
          {optionArray.map((option, index) => {
            return <option value={option.value}>{option.text}</option>;
          })}
        </select>

        <button
          className="button"
          onClick={() =>
            props.onClickAdd(inputValue, selectValue, descriptionValue)
          }
        >
          Sell
        </button>
      </div>
    </>
  );
};
