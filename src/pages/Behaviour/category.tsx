import _ from "lodash";
import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import * as ApiService from "../../services/auth";

const BehaviorCategoryManager = () => {
  const [formData, setFormData] = useState({
    name: "",
    EE: "Demonstrates behavior above the expected level consistently.",
    ME: "Demonstrates behavior at the expected level regularly.",
    AE: "Demonstrates behavior slightly below the expected level occasionally.",
    BE: "Rarely demonstrates behavior at the expected level.",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreating, setIsCreating] = useState(true); // State to toggle form and table

  const fetchBehaviorCategories = async () => {
    try {
      const response = await ApiService.getBehaviour();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBehaviorCategories();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await ApiService.createBehaviour(formData);
      setSuccessMessage("Behavior category created successfully.");
      setFormData({
        name: "",
        EE: "Demonstrates behavior above the expected level consistently.",
        ME: "Demonstrates behavior at the expected level regularly.",
        AE: "Demonstrates behavior slightly below the expected level occasionally.",
        BE: "Rarely demonstrates behavior at the expected level.",
      });
      fetchBehaviorCategories();
      setIsCreating(false); // Switch to table view after creating
    } catch (error) {
      setError("Error creating behavior category. Try again.");
      console.error("Error creating behavior category:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">
        {isCreating ? "Create Behavior Category" : "Manage Behavior Categories"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}

      {/* Button to toggle between form and table */}
      <Button onClick={() => setIsCreating(!isCreating)} className="mb-4">
        {isCreating ? "View Categories" : "Create New Category"}
      </Button>

      {/* Form to create a new behavior category */}
      {isCreating ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">EE Description</label>
            <textarea
              name="EE"
              value={formData.EE}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Enter EE description"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">ME Description</label>
            <textarea
              name="ME"
              value={formData.ME}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Enter ME description"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">AE Description</label>
            <textarea
              name="AE"
              value={formData.AE}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Enter AE description"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">BE Description</label>
            <textarea
              name="BE"
              value={formData.BE}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              placeholder="Enter BE description"
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Create Category
          </button>
        </form>
      ) : (
        // Table to display the behavior categories
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-4 text-left">
                Category Name
              </th>
              <th className="border border-gray-300 p-4 text-left">
                EE Description
              </th>
              <th className="border border-gray-300 p-4 text-left">
                ME Description
              </th>
              <th className="border border-gray-300 p-4 text-left">
                AE Description
              </th>
              <th className="border border-gray-300 p-4 text-left">
                BE Description
              </th>
              <th className="border border-gray-300 p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category: any) => (
                <tr key={category._id}>
                  <td className="border border-gray-300 p-4">
                    {category.name}
                  </td>
                  <td className="border border-gray-300 p-4">{category.EE}</td>
                  <td className="border border-gray-300 p-4">{category.ME}</td>
                  <td className="border border-gray-300 p-4">{category.AE}</td>
                  <td className="border border-gray-300 p-4">{category.BE}</td>
                  <td className="border border-gray-300 p-4">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        /* add delete logic */
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 p-4 text-center"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BehaviorCategoryManager;
