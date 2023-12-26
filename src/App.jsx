import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [seed, setSeed] = useState();
  const [valueSlider, setValueSlider] = useState(0);
  const [isFetching, setIsFetching] = useState(true);
  const [disabledState, setDisabledState] = useState(false);

  // Первая порция юзеров
  useEffect(() => {
    if (isFetching) {
      async function getUsers() {
        let response = axios(process.env.REACT_APP_API_URL);
        // let response = axios.get("http://localhost:5555/");
        const data = await response;
        setUsers([...users, ...data.data]);
        response.then(() => setIsFetching(false));
      }
      getUsers();
    }
  }, [isFetching]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  // Додгрузка юзеров(бесконечный скролл)
  function scrollHandler(e) {
    let scrollHeight = e.target.documentElement.scrollHeight; // высота html страницы с учетом скролла
    let scrollTop = e.target.documentElement.scrollTop; // расстояние от начала страницы
    let innerHeight = window.innerHeight; // высота html страницы

    if (scrollHeight - (scrollTop + innerHeight) < 100) {
      setIsFetching(true);
    }
  }

  // Инпут ползунок
  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setValueSlider(newValue);

    let usersWithErrors = users.map((user) => {
      const errorPlace = Math.floor(Math.random() * 3);
      switch (errorPlace) {
        case 0:
          return { ...user, name: addRandomError(user.name, newValue) };
          break;
        case 1:
          return { ...user, number: addRandomError(user.number, newValue) };
          break;
        case 2:
          return { ...user, addres: addRandomError(user.addres, newValue) };
          break;
      }
    });
    setUsers(usersWithErrors);
  };

  // Генерация случайной ошибки в строке
  function addRandomError(string, errrsQtty) {
    for (let i = 0; i < errrsQtty; i++) {
      const index = Math.floor(Math.random() * string.length);
      const errorType = Math.floor(Math.random() * 3);

      switch (errorType) {
        // Замена символа
        case 0:
          const replacementChar = String.fromCharCode(
            Math.floor(Math.random() * 32) + 1072
          );
          string =
            string.substring(0, index) +
            replacementChar +
            string.substring(index + 1);
          break;

        // Удаление символа
        case 1:
          string = string.substring(0, index) + string.substring(index + 1);
          break;

        // Добавление лишнего символа
        case 2:
          const extraChar = String.fromCharCode(
            Math.floor(Math.random() * 32) + 1072
          );
          string =
            string.substring(0, index) + extraChar + string.substring(index);
          break;

        default:
          break;
      }
    }
    return string;
  }

  // При изменении seed-a
  function onSeedChange(e) {
    try {
      setDisabledState(true);
      let currVal = e.target.value;
      setSeed(currVal);

      async function getUsers() {
        let response = axios.post(process.env.REACT_APP_API_URL + "seed", {
          // let response = axios.post("http://localhost:5555/seed", {
          seed: currVal,
        });
        const data = await response;
        setUsers([...data.data]);
        response.then(() => setIsFetching(false));
        setDisabledState(false);
      }
      getUsers();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  // При клике на seed random
  function onSeedRandomClick() {
    try {
      setDisabledState(true);
      let randomVal = Math.floor(Math.random() * 100000);
      let currVal = randomVal;
      setSeed(currVal);

      async function getUsers() {
        let response = axios.post(process.env.REACT_APP_API_URL + "seed", {
          // let response = axios.post("http://localhost:5555/seed", {
          seed: currVal,
        });
        const data = await response;
        setUsers([...data.data]);
        response.then(() => setIsFetching(false));
        setDisabledState(false);
      }
      getUsers();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return (
    <>
      <nav className="navbar navbar-light bg-light p-3">
        <div className="container gap-2">
          <div className="d-flex align-items-center">
            <div className="me-3 fs-5">Reginon:</div>
            <div className="dropdown">
              <a
                className="btn btn-secondary dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                RU-ru
              </a>

              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <a className="dropdown-item" href="#">
                    RU-ru
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3 fs-5">Errors:</div>
            <input
              type="range"
              min={0}
              max={10}
              value={valueSlider}
              onChange={(e) => handleSliderChange(e)}
              className="form-control-range me-3"
            />
            <input
              value={valueSlider}
              onChange={
                ((e) => setValueSlider(e.target.value),
                (e) => handleSliderChange(e))
              }
              className="cust_inp_width"
              type="number"
              min="0"
              max="1000"
            />
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3 fs-5">Seed:</div>
            <input
              value={seed}
              onChange={(e) => onSeedChange(e)}
              className="me-2"
              type="number"
            />
            <button
              onClick={() => onSeedRandomClick()}
              className="btn btn-outline-dark"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-shuffle"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
                />
                <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <br />
      <div className="container table-responsive">
        <table className={"table " + (disabledState ? "opacity_custom" : "")}>
          <tbody>
            {users == "" ? (
              <p className="fetching_loading">loading...</p>
            ) : (
              users.map((user, index) => {
                return (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.addres}</td>
                    <td>{user.number}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
