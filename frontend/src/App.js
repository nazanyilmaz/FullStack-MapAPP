import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import Map, { Marker, Popup, useMap } from "react-map-gl";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(1);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [viewport, setViewPort] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 4,
  });
  const { current: map } = useMap();

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data.pins || []); // Yanıt içinde "pins" kontrolü
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewPort({ ...viewport, latitude: lat, longitude: long });
    console.log("Current Place ID:", currentPlaceId);
    console.log("Clicked Pin ID:", id);
  };

  const handleAddClick = (e) => {
    const lat = Number(e.lngLat.lat);
    const long = Number(e.lngLat.lng);
    console.log("Double Click at:", lat, long);

    setNewPlace({ long, lat });

    console.log("Valid Lat/Long:", lat, long);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // newPlace değerlerinin geçerliliğini kontrol et
    if (
      !newPlace ||
      typeof newPlace.lat !== "number" ||
      typeof newPlace.long !== "number"
    ) {
      console.error("Invalid newPlace:", newPlace);
      return; // Geçersizse fonksiyondan çık
    }
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
      console.error(
        "Error submitting pin:",
        error.response ? error.response.data : error.message
      );
    }
    console.log("New Pin:", newPin);
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 4,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        transitionDuration="1000"
      >
        {pins &&
          Array.isArray(pins) &&
          pins.map((p) => (
            <div key={p._id}>
              {p.lat !== undefined && p.long !== undefined && (
                <Marker
                  key={`marker-${p._id}`}
                  longitude={p.long}
                  latitude={p.lat}
                >
                  <FaMapMarkerAlt
                    style={{
                      color:
                        p.username === currentUser ? "tomato" : "slateblue",
                      cursor: "pointer",
                    }}
                    size={35}
                    onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                  />
                </Marker>
              )}
              {currentPlaceId === p._id &&
                p.lat !== undefined &&
                p.long !== undefined && (
                  <Popup
                    longitude={p.long}
                    latitude={p.lat}
                    anchor="bottom"
                    onClose={() => setCurrentPlaceId(null)}
                    closeOnClick={false}
                  >
                    <div className="card">
                      <h4 className="place">{p.title}</h4>
                      <p>{p.desc}</p>
                      <div className="stars">
                        {Array(p.rating).fill(<FaStar className="star" />)}
                      </div>
                      <span className="username">
                        Created by <b className="name">{p.username}</b>
                      </span>

                      <span className="date">
                        {moment(p.createdAt).fromNow()}
                      </span>
                    </div>
                  </Popup>
                )}
            </div>
          ))}
        {newPlace &&
          newPlace.lat !== undefined &&
          newPlace.long !== undefined && (
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              anchor="bottom"
              onClose={() => setNewPlace(null)}
              closeOnClick={false}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    placeholder="title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    placeholder="desc."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option className="optOne">rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" type="submit">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="buttons">
            <button
              className="button register"
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              Register
            </button>
            <button
              className="button login"
              onClick={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            >
              Login
            </button>
          </div>
        )}
        {!currentUser && showRegister && (
          <Register
            setShowRegister={setShowRegister}
            setShowLogin={setShowLogin}
            currentUser={currentUser}
          />
        )}
        {!currentUser && showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
