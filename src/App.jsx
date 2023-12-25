import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [seed, setSeed] = useState(0);
  const [valueSlider, setValueSlider] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFetching) {
      async function getUsers() {
        let response = axios(process.env.REACT_APP_API_URL);
        // let response = axios.get("http://localhost:5555/");
        // let response = axios.post("http://localhost:5555/seed", {
        //   seed: seed,
        // });
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

  function scrollHandler(e) {
    let scrollHeight = e.target.documentElement.scrollHeight; // высота html страницы с учетом скролла
    let scrollTop = e.target.documentElement.scrollTop; // расстояние от начала страницы
    let innerHeight = window.innerHeight; // высота html страницы

    if (scrollHeight - (scrollTop + innerHeight) < 100) {
      // setSeed((prev) => prev + 1);
      setIsFetching(true);
    }
  }

  const handleSliderChange = (event) => {
    const newValue = event.target.value;
    setValueSlider(newValue);

    let arrWithErrors = users.map((user) => {
      // Надо логику: иногда ретурнить user.name, иногда user.addres, иногда user.phone
      return { ...user, name: addRandomError(user.name, newValue) };
    });
    setUsers(arrWithErrors);
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

  function onSeedChange(e) {
    console.log("сработал onSeedChange()");
    console.log(seed);
    try {
      let currVal = e.target.value;
      setSeed(currVal);

      async function getUsers() {
        let response = axios.post(`${process.env.REACT_APP_API_URL + "seed"}`, {
          // let response = axios.post("http://localhost:5555/seed", {
          // seed: currVal,
          seed: seed,
        });
        const data = await response;
        setUsers([...data.data]);
        response.then(() => setIsFetching(false));
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
                Dropdown link
              </a>

              <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
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
              type="number"
            />
          </div>
        </div>
      </nav>

      <br />
      <div className="container table-responsive">
        <table className="table">
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.addres}</td>
                  <td>{user.number}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
