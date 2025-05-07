import React, { useState, useEffect, useCallback } from "react";
import * as ApiService from "../../services/auth";
import { parse } from "date-fns";

// Define interfaces for type safety
interface TimeSlot {
  _id: string;
  name?: string;
  startTime: string;
  endTime: string;
  slotNumber: string;
  isFixed: boolean;
}

interface NewTimeSlot {
  name?: string;
  startTime: string;
  endTime: string;
  slotNumber: string;
  isFixed: boolean;
}

const TimeSlots: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState<NewTimeSlot>({
    name: "",
    startTime: "",
    endTime: "",
    slotNumber: "",
    isFixed: false,
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Predefined slot names from schema
  const slotNames = [
    "Break",
    "Lunch",
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Assembly",
    "Recess",
  ];

  // Fetch time slots with error handling
  const fetchTimeSlots = useCallback(async () => {
    try {
      setIsLoading(true);
      const data: TimeSlot[] = await ApiService.getTimeSlots({});
      setTimeSlots(
        data.sort(
          (a, b) =>
            parse(a.startTime, "HH:mm", new Date()).getTime() -
            parse(b.startTime, "HH:mm", new Date()).getTime()
        )
      );
    } catch (err) {
      setError("Failed to fetch time slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  // Validate time format and slot number
  const validateInput = (): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(newTimeSlot.startTime) ||
      !timeRegex.test(newTimeSlot.endTime)
    ) {
      setError("Please enter valid times in HH:MM format");
      return false;
    }
    if (!newTimeSlot.slotNumber || parseInt(newTimeSlot.slotNumber) <= 0) {
      setError("Please enter a valid slot number");
      return false;
    }
    const start = parse(newTimeSlot.startTime, "HH:mm", new Date());
    const end = parse(newTimeSlot.endTime, "HH:mm", new Date());
    if (end <= start) {
      setError("End time must be after start time");
      return false;
    }
    // if (newTimeSlot.isFixed && !slotNames.includes(newTimeSlot.name || "")) {
    //   setError("Please select a valid slot name for fixed slots");
    //   return false;
    // }
    // if (!newTimeSlot.isFixed && !newTimeSlot.name) {
    //   setError("Please enter a name for non-fixed slots");
    //   return false;
    // }
    return true;
  };

  const handleCreate = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      setIsLoading(true);
      const created: TimeSlot = await ApiService.createTimeSlot(newTimeSlot);
      setTimeSlots(
        [...timeSlots, created].sort(
          (a, b) =>
            parse(a.startTime, "HH:mm", new Date()).getTime() -
            parse(b.startTime, "HH:mm", new Date()).getTime()
        )
      );
      setNewTimeSlot({
        name: "",
        startTime: "",
        endTime: "",
        slotNumber: "",
        isFixed: false,
      });
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch time slots. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    id: string,
    updates: Partial<TimeSlot>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const updated: TimeSlot = await ApiService.updateTimeSlot(id, updates);
      setTimeSlots(timeSlots.map((ts) => (ts._id === id ? updated : ts)));
      setNewTimeSlot({
        name: "",
        startTime: "",
        endTime: "",
        slotNumber: "",
        isFixed: false,
      });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Failed to update time slot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await ApiService.deleteTimeSlot(id);
      setNewTimeSlot({
        name: "",
        startTime: "",
        endTime: "",
        slotNumber: "",
        isFixed: false,
      });
      setTimeSlots(timeSlots.filter((ts) => ts._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete time slot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (ts: TimeSlot) => {
    setEditingId(ts._id);
    setNewTimeSlot({
      name: ts.name || "",
      startTime: ts.startTime,
      endTime: ts.endTime,
      slotNumber: ts.slotNumber,
      isFixed: ts.isFixed,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !validateInput()) return;

    await handleUpdate(editingId, newTimeSlot);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-5">Time Slots Management</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Create/Edit Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-100 rounded-lg">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newTimeSlot.isFixed}
            onChange={(e) =>
              setNewTimeSlot({
                ...newTimeSlot,
                isFixed: e.target.checked,
                name: e.target.checked ? "Period 1" : "",
              })
            }
            className="mr-2"
            disabled={isLoading}
          />
          Fixed Slot
        </label>
        {newTimeSlot.isFixed ? (
          <input
            type="text"
            value={newTimeSlot.name || ""}
            onChange={(e) =>
              setNewTimeSlot({ ...newTimeSlot, name: e.target.value })
            }
            className="p-2 border rounded-md disabled:bg-gray-200"
            placeholder="Program Name"
            disabled={isLoading}
          />
        ) : (
          <></>
        )}
        <input
          type="time"
          value={newTimeSlot.startTime}
          onChange={(e) =>
            setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })
          }
          className="p-2 border rounded-md disabled:bg-gray-200"
          placeholder="Start Time"
          disabled={isLoading}
        />
        <input
          type="time"
          value={newTimeSlot.endTime}
          onChange={(e) =>
            setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })
          }
          className="p-2 border rounded-md disabled:bg-gray-200"
          placeholder="End Time"
          disabled={isLoading}
        />
        <input
          type="number"
          value={newTimeSlot.slotNumber}
          onChange={(e) =>
            setNewTimeSlot({ ...newTimeSlot, slotNumber: e.target.value })
          }
          className="p-2 border rounded-md disabled:bg-gray-200"
          placeholder="Slot Number"
          min="1"
          disabled={isLoading}
        />
        <button
          onClick={editingId ? handleSaveEdit : handleCreate}
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Processing..."
            : editingId
            ? "Save"
            : "Create Time Slot"}
        </button>
      </div>

      {/* Time Slots List */}
      {isLoading && !timeSlots.length ? (
        <p className="text-gray-600">Loading...</p>
      ) : timeSlots.length === 0 ? (
        <p className="text-gray-600">
          No time slots available. Create one above!
        </p>
      ) : (
        timeSlots.map((ts) => (
          <div
            key={ts._id}
            className="flex justify-between items-center p-4 mb-3 bg-white rounded-lg shadow-sm"
          >
            <div>
              <strong className="text-lg">Slot {ts.slotNumber}</strong>:{" "}
              {ts.startTime} - {ts.endTime}
              <br />
              <small
                className={ts.isFixed ? "text-blue-600" : "text-green-600"}
              >
                {ts.isFixed ? `Fixed: ${ts.name}` : ``}
              </small>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(ts)}
                disabled={isLoading}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(ts._id)}
                disabled={isLoading}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TimeSlots;
