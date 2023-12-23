import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [valueSlider, setValueSlider] = useState(0);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (isFetching) {
      // console.log("fetching");
      // console.log(isFetching);
      async function getUsers() {
        let response = axios(process.env.REACT_APP_API_URL);
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
      setIsFetching(true);
    }
  }

  const handleRangeChange = (event) => {
    const newValue = event.target.value;
    console.log(newValue);
    setValueSlider(newValue);
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light p-3">
        <div className="container">
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
              onChange={(e) => handleRangeChange(e)}
              className="form-control-range me-3"
            />
            <input value={valueSlider} className="cust_inp_width" type="text" />
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3 fs-5">Seed:</div>
            <input type="text" />
          </div>
        </div>
      </nav>
      <br />
      <div className="container">
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
