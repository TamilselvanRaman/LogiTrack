import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import authService from "../../services/auth.service";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.getProfile();
        setUser(data.user);
        setCargos(data.cargos || []);
        setFormData({
          username: data.user.username || "",
          email: data.user.email || "",
          contact: data.user.contact || "",
          address: data.user.address || "",
        });
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Sort cargos: active first (status === "current" or "active"), then others
  const sortedCargos = [...cargos].sort((a, b) => {
    const activeStatus = ["current", "active"];
    const aIsActive = activeStatus.includes(a.status?.toLowerCase());
    const bIsActive = activeStatus.includes(b.status?.toLowerCase());
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return 0;
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditToggle = () => {
    setEditing((prev) => !prev);
    if (editing && user) {
      setFormData({
        username: user.username,
        email: user.email,
        contact: user.contact,
        address: user.address,
      });
      setError(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const data = await authService.updateProfile(formData);
      setUser(data.user);
      setCargos(data.cargos || []);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-600 font-medium tracking-wide">
        Loading profile...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold tracking-wide">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">
      {/* Left Side: Profile */}
      <section className="w-full md:w-2/3 lg:w-1/2 mx-auto p-8 bg-white shadow-xl rounded-2xl flex flex-col space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">
            User Profile
          </h1>

          <button
            onClick={handleEditToggle}
            className="inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            {editing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>

        {/* Display or Form Section */}
        {!editing ? (
          <div className="flex flex-col space-y-4 text-gray-800 text-base">
            {[
              { label: "Username", value: user.username },
              { label: "Email", value: user.email },
              { label: "Contact", value: user.contact || "-" },
              { label: "Address", value: user.address || "-" },
              { label: "Role", value: user.role },
              {
                label: "Created At",
                value: new Date(user.createdAt).toLocaleDateString(),
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start">
                <dt className="w-40 font-semibold text-indigo-700">{label}:</dt>
                <dd className="flex-1">{value}</dd>
              </div>
            ))}
          </div>
        ) : (
          <form
            onSubmit={handleUpdate}
            className="space-y-6"
            noValidate
            autoComplete="off"
          >
            {[
              {
                label: "Username",
                name: "username",
                type: "text",
                required: true,
              },
              { label: "Email", name: "email", type: "email", required: true },
              { label: "Contact", name: "contact", type: "text" },
              { label: "Address", name: "address", type: "text" },
            ].map(({ label, name, type, required }) => (
              <div key={name} className="relative z-0 w-full group">
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  disabled={updating}
                  required={required}
                  className="block py-2.5 px-0 w-full text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor={name}
                  className="absolute text-lg text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-indigo-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100"
                >
                  {label}
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={updating}
              className={`w-full py-3 rounded-md text-white font-bold transition ${
                updating
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900"
              }`}
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-indigo-600 text-indigo-600 rounded-md font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            Home Page
          </button>
        </div>
      </section>

      {/* Right Side: Cargos */}
      <section className="w-full md:w-1/2 p-8 overflow-y-auto bg-indigo-50">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-12 border-b-4 border-indigo-600 pb-3">
          {user.role === "business" ? "Your Cargos" : "Assigned Cargos"}
        </h2>

        {sortedCargos.length === 0 ? (
          <p className="italic text-indigo-700 text-lg">No cargos found.</p>
        ) : (
          <div className="space-y-6">
            {sortedCargos.map((cargo) => (
              <div
                key={cargo._id}
                className={`bg-white rounded-xl shadow-md p-6 border ${
                  ["current", "active"].includes(cargo.status?.toLowerCase())
                    ? "border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                <h3 className="text-2xl font-semibold text-indigo-700 mb-3">
                  {cargo.name}
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className="capitalize">{cargo.status || "N/A"}</span>
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Origin:</span> {cargo.origin}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Destination:</span>{" "}
                  {cargo.destination}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
