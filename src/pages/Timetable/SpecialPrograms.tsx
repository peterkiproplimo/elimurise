// components/SpecialPrograms.tsx
import React, { useState, useEffect } from "react";
import * as ApiService from "../../services/auth";

const SpecialPrograms: React.FC = () => {
  const [specialPrograms, setSpecialPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState({
    name: "",
    durationMinutes: "",
    description: "",
    isMandatory: false,
    maxPerDay: "1",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgram, setEditProgram] = useState<any>(null);

  // Fetch special programs on mount
  useEffect(() => {
    fetchSpecialPrograms();
  }, []);

  const fetchSpecialPrograms = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getSpecialPrograms();
      setSpecialPrograms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for new program
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setNewProgram((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Create a new special program
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: newProgram.name,
        durationMinutes: parseInt(newProgram.durationMinutes, 10),
        description: newProgram.description,
        isMandatory: newProgram.isMandatory,
        maxPerDay: parseInt(newProgram.maxPerDay, 10),
      };
      const createdProgram = await ApiService.createSpecialProgram(data);
      setSpecialPrograms([...specialPrograms, createdProgram]);
      setNewProgram({
        name: "",
        durationMinutes: "",
        description: "",
        isMandatory: false,
        maxPerDay: "1",
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a program
  const handleEdit = (program: any) => {
    setEditingId(program._id);
    setEditProgram({
      ...program,
      durationMinutes: program.durationMinutes.toString(),
      maxPerDay: program.maxPerDay.toString(),
    });
  };

  // Handle edit input changes
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditProgram((prev: any) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Save edited program
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: editProgram.name,
        durationMinutes: parseInt(editProgram.durationMinutes, 10),
        description: editProgram.description,
        isMandatory: editProgram.isMandatory,
        maxPerDay: parseInt(editProgram.maxPerDay, 10),
      };
      const updatedProgram = await ApiService.updateSpecialProgram(
        editProgram._id,
        data
      );
      setSpecialPrograms(
        specialPrograms.map((p) =>
          p._id === editProgram._id ? updatedProgram : p
        )
      );
      setEditingId(null);
      setEditProgram(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a program
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await ApiService.deleteSpecialProgram(id);
      setSpecialPrograms(specialPrograms.filter((p) => p._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Special Programs
      </h2>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              list="programs"
              value={newProgram.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
              placeholder="Select or type a program"
            />
            {/* <datalist id="programs">
              {["Free", "Break", "Lunch", "PE", "PPI"].map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist> */}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={newProgram.durationMinutes}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={newProgram.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max Per Day
            </label>
            <input
              type="number"
              name="maxPerDay"
              value={newProgram.maxPerDay}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
              min="0"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isMandatory"
              checked={newProgram.isMandatory}
              onChange={handleInputChange}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Mandatory
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 dark:hover:bg-teal-500 disabled:bg-teal-400 transition-colors duration-200"
        >
          {loading ? "Creating..." : "Create Special Program"}
        </button>
      </form>

      {/* Program List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mandatory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Max/Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : specialPrograms.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No special programs found.
                </td>
              </tr>
            ) : (
              specialPrograms.map((program) => (
                <tr
                  key={program._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  {editingId === program._id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="name"
                          value={editProgram.name}
                          onChange={handleEditChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        >
                          {["Free", "Break", "Lunch", "PE", "PPI"].map(
                            (name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="durationMinutes"
                          value={editProgram.durationMinutes}
                          onChange={handleEditChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                          min="1"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="description"
                          value={editProgram.description}
                          onChange={handleEditChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          name="isMandatory"
                          checked={editProgram.isMandatory}
                          onChange={handleEditChange}
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="maxPerDay"
                          value={editProgram.maxPerDay}
                          onChange={handleEditChange}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-teal-500 focus:ring-teal-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={handleSaveEdit}
                          className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 mr-4"
                          disabled={loading}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditProgram(null);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {program.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {program.durationMinutes} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {program.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {program.isMandatory ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                        {program.maxPerDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(program)}
                          className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(program._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecialPrograms;
