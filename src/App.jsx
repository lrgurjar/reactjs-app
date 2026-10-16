import DetailsCardComponent from "./components/DetailsCardComponent.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [recordData, setRecordData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Vite environment variables
  const base_url =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_LOCAL_BASE_URL
      : import.meta.env.VITE_SERVER_BASE_URL;

  console.log("Vite environment:", import.meta.env.MODE);
  console.log("API Base URL:", base_url);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${base_url}/getUsers`);

      setRecordData(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Unable to fetch users. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, [base_url]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Add a new user
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${base_url}/addUser`, formData);

      setFormData({
        name: "",
        email: "",
      });

      alert("User created successfully");

      // Refresh the user list
      await fetchUsers();
    } catch (err) {
      console.error("Add user error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to create user. Please try again.",
      );
    }
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar navbar-light bg-light mb-2">
        <a
          className="navbar-brand"
          href="https://www.youtube.com/@IntegrationNinjas"
        >
          react js app
        </a>
      </nav>

      <div className="container">
        <div className="row">
          {/* Users List */}
          <div className="col">
            <h3 className="text-center">Registered Users</h3>

            {loading && <p>Loading users...</p>}

            {error && (
              <div className="alert alert-danger">
                {error}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={fetchUsers}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && recordData.length === 0 && (
              <p>No users found.</p>
            )}

            <ul className="list-group">
              {recordData.map((user, index) => (
                <li
                  className="list-group-item"
                  key={user._id || user.id || user.email}
                >
                  <DetailsCardComponent
                    email={user.email}
                    sn={index + 1}
                    userN={user.name}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Add User Form */}
          <div className="col">
            <h2>Add Users</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="exampleInputUser">User Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleInputUser"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  required
                />
              </div>

              <div className="form-group mt-2">
                <label htmlFor="exampleInputEmail">Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-2"
                disabled={loading}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
