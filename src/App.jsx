/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./style-dark.scss";

// const list = [
//   {
//     id: 1,
//     task: "Do gardening",
//     completed: true,
//   },
//   {
//     id: 2,
//     task: "Water the plant",
//     completed: false,
//   },
//   {
//     id: 3,
//     task: "Code todo app",
//     completed: false,
//   },
// ];

function App() {
  const [input, setInput] = useState("");
  const [list, SetList] = useState([]);
  const [itemCount, setItemCount] = useState(list.length);
  const [active, setActive] = useState([]);
  const [currentActiveList, setCurrentActiveList] = useState(list);
  const [currentTab, setCurrentTab] = useState("all");
  return (
    <div className="app">
      <Header />
      <ToDoInput
        input={input}
        list={list}
        onSetItemCount={setItemCount}
        onSetInput={setInput}
        onSetList={SetList}
        onSetCurrentActiveList={setCurrentActiveList}
      />
      <ToDoSection
        list={list}
        itemCount={itemCount}
        active={active}
        currentActiveList={currentActiveList}
        onSetList={SetList}
        onSetItemCount={setItemCount}
        onSetActive={setActive}
        onSetCurrentActiveList={setCurrentActiveList}
        onSetCurrentTab={setCurrentTab}
      >
        <Filter
          list={list}
          itemCount={itemCount}
          active={active}
          currentTab={currentTab}
          currentActiveList={currentActiveList}
          onSetActive={setActive}
          onSetCurrentActiveList={setCurrentActiveList}
          onSetList={SetList}
          onSetCurrentTab={setCurrentTab}
        />
      </ToDoSection>
    </div>
  );
}
export default App;

function Header() {
  return (
    <div className="header">
      <h1>TODO</h1>
      <img src="./images/bg-desktop-dark.jpg" alt="bg-desktop" />
    </div>
  );
}

function ToDoInput({
  input,
  onSetInput,
  onSetList,
  isCompleted,
  onSetItemCount,
  list,
  onSetCurrentActiveList,
}) {
  function setInput(e) {
    onSetInput(e.target.value);
  }
  function addToList(e) {
    if (e.key === "Enter" && e.target.value !== "") {
      const newItem = {
        id: Math.floor(Math.random() * Date.now()).toString(16),
        task: e.target.value,
        isCompleted: isCompleted,
      };
      onSetList((previous) => [...previous, newItem]);
      onSetInput("");
    }
  }
  useEffect(
    function () {
      onSetCurrentActiveList(list);
    },
    [list]
  );

  useEffect(
    function () {
      onSetItemCount(list.length);
    },
    [list]
  );
  return (
    <div className="input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e)}
        onKeyDown={(e) => addToList(e)}
        placeholder="Add New"
      ></input>
    </div>
  );
}

function ToDoSection({
  children,
  list,
  onSetList,
  onSetItemCount,
  active,
  onSetActive,
  currentActiveList,
  onSetCurrentActiveList,
  onSetCurrentTab,
}) {
  function handleChecked(id, e) {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    onSetList(() => updatedList);
    if (!e.target.checked) onSetCurrentTab(() => "all");
  }

  useEffect(
    function () {
      const checked = list.filter((item) => item.isCompleted);
      onSetItemCount((count) => count - checked.length);
      onSetActive(() => checked);
    },
    [list]
  );

  return (
    <List
      list={list}
      onChecked={handleChecked}
      onSetList={onSetList}
      active={active}
      currentActiveList={currentActiveList}
      onSetCurrentActiveList={onSetCurrentActiveList}
      onSetCurrentTab={onSetCurrentTab}
    >
      {children}
    </List>
  );
}

function List({
  children,
  list,
  onChecked,
  onSetList,
  currentActiveList,
  onSetCurrentActiveList,
  onSetCurrentTab,
}) {
  const listTextStyle = { textDecoration: "line-through" };
  function handleDelete(id) {
    const updatedList = list.filter((item) => item.id !== id);
    onSetList(updatedList);
    onSetCurrentActiveList(updatedList);
    onSetCurrentTab(() => "all");
  }
  return (
    <div className="todo">
      <ul>
        {currentActiveList.map((item) => {
          return (
            <li key={item.id}>
              <input type="checkbox" onClick={(e) => onChecked(item.id, e)} />
              <p
                style={item.isCompleted ? listTextStyle : null}
                className="task"
              >
                {item.task}
              </p>
              <button onClick={() => handleDelete(item.id)}>×</button>
            </li>
          );
        })}
      </ul>
      {children}
    </div>
  );
}

function Filter({
  itemCount,
  list,
  onSetCurrentActiveList,
  active,
  onSetList,
  currentTab,
  onSetCurrentTab,
}) {
  function handleCompleted() {
    onSetCurrentActiveList(() => active);
    onSetCurrentTab(() => "completed");
  }

  function handleAll() {
    onSetCurrentActiveList(() => list);
    onSetCurrentTab(() => "all");
  }
  function handleClearCompleted() {
    const completed = list.filter((item) => !item.isCompleted);
    onSetList(() => completed);
    onSetCurrentTab(() => "all");
  }
  return (
    itemCount > 0 && (
      <div className="filter">
        <p>{itemCount} items left</p>
        <div className="filter-btns">
          <button
            className={currentTab === "all" ? "active" : ""}
            onClick={handleAll}
          >
            All
          </button>
          <button
            className={currentTab === "completed" ? "active" : ""}
            onClick={handleCompleted}
          >
            Completed
          </button>
          <button onClick={handleClearCompleted}>Clear Completed</button>
        </div>
      </div>
    )
  );
}
