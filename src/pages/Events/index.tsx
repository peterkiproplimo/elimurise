import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
  FormSwitch,
} from "../../base-components/Form";
import Table from "../../base-components/Table";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import Calendar from "../../components/Calendar";
import * as ApiService from "../../services/auth";

const EVENT_TYPES = [
  { value: "academic", label: "Academic" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "meeting", label: "Meeting" },
  { value: "holiday", label: "Holiday" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#f97316", label: "Orange" },
  { value: "#10b981", label: "Emerald" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#ec4899", label: "Pink" },
  { value: "#14b8a6", label: "Teal" },
];

const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  eventType: "all",
  startDate: "",
  endDate: "",
};

const DEFAULT_FORM_STATE = {
  _id: "",
  title: "",
  description: "",
  location: "",
  eventType: "academic",
  status: "draft",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  startTime: "08:00",
  endTime: "17:00",
  isAllDay: false,
  color: "#6366f1",
  isRecurring: false,
  recurringPattern: "",
  recurringEndDate: "",
};

const getMonthRange = (baseDate: Date = new Date()) => {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const formatDisplayDate = (date: string | Date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatDateInput = (date?: string | Date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

function EventsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [events, setEvents] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    upcomingCount: 0,
    statusCounts: {
      draft: 0,
      published: 0,
      completed: 0,
      cancelled: 0,
    },
    upcomingEvents: [] as any[],
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [calendarRange, setCalendarRange] = useState(getMonthRange());
  const [isSaving, setIsSaving] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const notify = useRef<NotificationElement>();

  const showToast = (text: string, ok = true) => {
    setMessage(text);
    setSuccess(ok);
    notify.current?.showToast();
  };

  const sanitizedFilters = useMemo(() => {
    const payload: Record<string, any> = {
      search: filters.search || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
    };

    if (filters.status !== "all") {
      payload.status = filters.status;
    }

    if (filters.eventType !== "all") {
      payload.eventType = filters.eventType;
    }

    return payload;
  }, [filters]);

  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const response = await ApiService.getEvents({
        ...sanitizedFilters,
        page: pagination.page,
        limit: pagination.limit,
        sort: "startDate",
        sortOrder: "asc",
      });

      // Handle both response structures: { data: [...], meta: {...} } or direct response
      const eventsData = response?.data || response || [];
      const metaData = response?.meta || {};
      
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setMeta({
        total: metaData.total || 0,
        totalPages: metaData.totalPages || 1,
      });
    } catch (error: any) {
      showToast(error?.message || "Unable to load events", false);
    } finally {
      setLoadingEvents(false);
    }
  }, [sanitizedFilters, pagination]);

  const fetchCalendarData = useCallback(
    async (range = calendarRange) => {
      if (!range.start || !range.end) return;
      setLoadingCalendar(true);
      try {
        const response = await ApiService.getCalendarEvents({
          start: range.start.toISOString(),
          end: range.end.toISOString(),
        });
        // Handle both response structures: { data: [...] } or direct array
        const events = response?.data || response || [];
        setCalendarEvents(Array.isArray(events) ? events : []);
      } catch (error: any) {
        showToast(error?.message || "Unable to load calendar events", false);
        setCalendarEvents([]);
      } finally {
        setLoadingCalendar(false);
      }
    },
    [calendarRange]
  );

  const fetchStats = useCallback(async () => {
    try {
      const response = await ApiService.getEventStats();
      // Handle both response structures: { data: {...} } or direct object
      const summary = response?.data || response || {};
      setStats({
        todayCount: summary?.todayCount || 0,
        upcomingCount: summary?.upcomingCount || 0,
        statusCounts: summary?.statusCounts || {
          draft: 0,
          published: 0,
          completed: 0,
          cancelled: 0,
        },
        upcomingEvents: Array.isArray(summary?.upcomingEvents) ? summary.upcomingEvents : [],
      });
    } catch (error: any) {
      console.error("Error loading event stats:", error?.message);
      // Set default stats on error
      setStats({
        todayCount: 0,
        upcomingCount: 0,
        statusCounts: {
          draft: 0,
          published: 0,
          completed: 0,
          cancelled: 0,
        },
        upcomingEvents: [],
      });
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const resetForm = () => {
    setFormState(DEFAULT_FORM_STATE);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFormChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditEvent = (eventData: any) => {
    if (!eventData) return;
    setFormState({
      _id: eventData._id || "",
      title: eventData.title || "",
      description: eventData.description || "",
      location: eventData.location || "",
      eventType: eventData.eventType || "academic",
      status: eventData.status || "draft",
      startDate: formatDateInput(eventData.startDate) || DEFAULT_FORM_STATE.startDate,
      endDate: formatDateInput(eventData.endDate) || DEFAULT_FORM_STATE.endDate,
      startTime: eventData.startTime || DEFAULT_FORM_STATE.startTime,
      endTime: eventData.endTime || DEFAULT_FORM_STATE.endTime,
      isAllDay: Boolean(eventData.isAllDay),
      color: eventData.color || DEFAULT_FORM_STATE.color,
      isRecurring: Boolean(eventData.isRecurring),
      recurringPattern: eventData.recurringPattern || "",
      recurringEndDate: formatDateInput(eventData.recurringEndDate) || "",
    });
  };

  const handleCalendarEventClick = async (eventInfo: any) => {
    if (!eventInfo?.id) return;
    try {
      const response = await ApiService.getEventById(eventInfo.id);
      // Handle both response structures: { data: {...} } or direct object
      const eventData = response?.data || response;
      if (eventData) {
        handleEditEvent(eventData);
      } else {
        showToast("Event data not found", false);
      }
    } catch (error: any) {
      showToast(error?.message || "Unable to load event", false);
    }
  };

  const handleDateSelect = (date: string) => {
    if (!date) return;
    setFormState((prev) => ({
      ...prev,
      startDate: date,
      endDate: date,
    }));
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete?._id) return;
    try {
      await ApiService.deleteEvent(eventToDelete._id);
      showToast("Event deleted successfully");
      setShowDeleteDialog(false);
      setEventToDelete(null);
      fetchEvents();
      fetchCalendarData();
      fetchStats();
    } catch (error: any) {
      showToast(error?.message || "Unable to delete event", false);
    }
  };

  const handleStatusUpdate = async (eventId: string, status: string) => {
    try {
      setStatusUpdating(eventId);
      await ApiService.updateEventStatus(eventId, status);
      showToast("Event status updated");
      fetchEvents();
      fetchCalendarData();
      fetchStats();
    } catch (error: any) {
      showToast(error?.message || "Unable to update status", false);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate dates
    if (new Date(formState.startDate) > new Date(formState.endDate)) {
      showToast("End date must be after start date", false);
      return;
    }

    // Validate recurring event fields
    if (formState.isRecurring && !formState.recurringPattern) {
      showToast("Please select a recurring pattern", false);
      return;
    }

    if (formState.isRecurring && formState.recurringEndDate) {
      if (new Date(formState.recurringEndDate) < new Date(formState.endDate)) {
        showToast("Recurring end date must be after event end date", false);
        return;
      }
    }

    // Validate time fields for non-all-day events
    if (!formState.isAllDay) {
      if (!formState.startTime || !formState.endTime) {
        showToast("Please provide start and end times for timed events", false);
        return;
      }
      if (formState.startDate === formState.endDate && formState.startTime >= formState.endTime) {
        showToast("End time must be after start time for same-day events", false);
        return;
      }
    }

    const payload: any = {
      title: formState.title,
      description: formState.description,
      location: formState.location,
      eventType: formState.eventType,
      status: formState.status,
      startDate: formState.startDate,
      endDate: formState.endDate,
      isAllDay: formState.isAllDay,
      color: formState.color,
      isRecurring: formState.isRecurring,
    };

    // Only include time fields if not all-day
    if (!formState.isAllDay) {
      payload.startTime = formState.startTime;
      payload.endTime = formState.endTime;
    }

    // Only include recurring fields if recurring
    if (formState.isRecurring) {
      payload.recurringPattern = formState.recurringPattern;
      if (formState.recurringEndDate) {
        payload.recurringEndDate = formState.recurringEndDate;
      }
    }

    setIsSaving(true);
    try {
      if (formState._id) {
        await ApiService.updateEvent(formState._id, payload);
        showToast("Event updated successfully");
      } else {
        await ApiService.createEvent(payload);
        showToast("Event created successfully");
      }
      resetForm();
      fetchEvents();
      fetchCalendarData();
      fetchStats();
    } catch (error: any) {
      showToast(error?.message || "Unable to save event", false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMonthChange = (newDate: Date) => {
    if (!newDate) return;
    const nextRange = getMonthRange(newDate);
    setCalendarRange(nextRange);
    // Fetch calendar data with the new range
    fetchCalendarData(nextRange);
  };

  const handlePageChange = (direction: "prev" | "next") => {
    setPagination((prev) => {
      if (direction === "prev" && prev.page > 1) {
        return { ...prev, page: prev.page - 1 };
      }
      if (direction === "next" && prev.page < meta.totalPages) {
        return { ...prev, page: prev.page + 1 };
      }
      return prev;
    });
  };

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Calendar & Events</h2>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* Stats */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 box">
            <div className="flex items-center">
              <Lucide icon="Calendar" className="w-6 h-6 text-primary mr-3" />
              <div>
                <div className="text-slate-500">Events Today</div>
                <div className="text-2xl font-bold">{stats.todayCount}</div>
              </div>
            </div>
          </div>
          {STATUS_OPTIONS.slice(0, 3).map((status) => (
            <div className="p-5 box" key={status.value}>
              <div className="flex items-center">
                <Lucide icon="CheckSquare" className="w-6 h-6 text-primary mr-3" />
                <div>
                  <div className="text-slate-500">{status.label}</div>
                  <div className="text-2xl font-bold">
                    {stats.statusCounts?.[status.value as keyof typeof stats.statusCounts] || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar & Upcoming */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="box p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">School Calendar</h3>
                <p className="text-slate-500 text-sm">
                  Click a date to prefill the event form or select an existing event to edit.
                </p>
              </div>
              {loadingCalendar && <LoadingIcon icon="spinning-circles" className="w-5 h-5 text-slate-500" />}
            </div>
            <Calendar
              initialDate={calendarRange.start.toISOString().split("T")[0]}
              events={calendarEvents}
              onDateClick={handleDateSelect}
              onMonthChange={handleMonthChange}
              onEventClick={handleCalendarEventClick}
            />
          </div>

          <div className="box p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <span className="text-sm text-slate-500">
                {stats.upcomingCount} scheduled
              </span>
            </div>
            {stats.upcomingEvents.length === 0 ? (
              <div className="text-center text-slate-500 py-6">
                No upcoming events found
              </div>
            ) : (
              <div className="space-y-4">
                {stats.upcomingEvents.map((event) => (
                  <div
                    key={event._id || event.title}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDisplayDate(event.startDate)} &mdash;{" "}
                        {formatDisplayDate(event.endDate)}
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${event.color || "#e5e7eb"}33`, color: event.color || "#111827" }}
                    >
                      {event.eventType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="col-span-12 xl:col-span-4">
          <div className="box p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {formState._id ? "Edit Event" : "Create Event"}
              </h3>
              <Button variant="outline-secondary" size="sm" onClick={resetForm}>
                Reset
              </Button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <FormLabel>Title</FormLabel>
                <FormInput
                  name="title"
                  value={formState.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Parents Meeting"
                  required
                />
              </div>
              <div>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  name="description"
                  value={formState.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="Brief event overview"
                />
              </div>
              <div>
                <FormLabel>Location</FormLabel>
                <FormInput
                  name="location"
                  value={formState.location}
                  onChange={handleFormChange}
                  placeholder="Hall A, School Field..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>Event Type</FormLabel>
                  <FormSelect
                    name="eventType"
                    value={formState.eventType}
                    onChange={handleFormChange}
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                <div>
                  <FormLabel>Status</FormLabel>
                  <FormSelect
                    name="status"
                    value={formState.status}
                    onChange={handleFormChange}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </FormSelect>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>Start Date</FormLabel>
                  <FormInput
                    type="date"
                    name="startDate"
                    value={formState.startDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <FormLabel>End Date</FormLabel>
                  <FormInput
                    type="date"
                    name="endDate"
                    value={formState.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {!formState.isAllDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Start Time</FormLabel>
                    <FormInput
                      type="time"
                      name="startTime"
                      value={formState.startTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <FormLabel>End Time</FormLabel>
                    <FormInput
                      type="time"
                      name="endTime"
                      value={formState.endTime}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      type="checkbox"
                      checked={formState.isAllDay}
                      onChange={(e) => handleToggleChange("isAllDay", e.target.checked)}
                    />
                  </FormSwitch>
                  <span className="text-sm text-slate-600">All day event</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      type="checkbox"
                      checked={formState.isRecurring}
                      onChange={(e) => handleToggleChange("isRecurring", e.target.checked)}
                    />
                  </FormSwitch>
                  <span className="text-sm text-slate-600">Recurring</span>
                </div>
              </div>

              {formState.isRecurring && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Pattern</FormLabel>
                    <FormSelect
                      name="recurringPattern"
                      value={formState.recurringPattern}
                      onChange={handleFormChange}
                    >
                      <option value="">Select pattern</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </FormSelect>
                  </div>
                  <div>
                    <FormLabel>Repeats Until</FormLabel>
                    <FormInput
                      type="date"
                      name="recurringEndDate"
                      value={formState.recurringEndDate}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <FormLabel>Accent Color</FormLabel>
                <FormSelect
                  name="color"
                  value={formState.color}
                  onChange={handleFormChange}
                >
                  {COLOR_OPTIONS.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <Button variant="primary" type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <LoadingIcon icon="spinning-circles" className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Lucide icon="Save" className="w-4 h-4 mr-2" />
                    {formState._id ? "Update Event" : "Create Event"}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Filters */}
        <div className="col-span-12">
          <div className="box p-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <FormLabel>Search</FormLabel>
                <FormInput
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search by title"
                />
              </div>
              <div>
                <FormLabel>Status</FormLabel>
                <FormSelect
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <FormLabel>Type</FormLabel>
                <FormSelect
                  value={filters.eventType}
                  onChange={(e) => handleFilterChange("eventType", e.target.value)}
                >
                  <option value="all">All types</option>
                  {EVENT_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <FormLabel>Start Date</FormLabel>
                <FormInput
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <FormLabel>End Date</FormLabel>
                <FormInput
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Event Table */}
        <div className="col-span-12">
          <div className="box p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Event Planner</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange("prev")}
                >
                  Previous
                </Button>
                <div className="text-sm text-slate-500">
                  Page {pagination.page} of {meta.totalPages}
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={pagination.page >= meta.totalPages}
                  onClick={() => handlePageChange("next")}
                >
                  Next
                </Button>
              </div>
            </div>

            {loadingEvents ? (
              <div className="py-10 flex justify-center">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8 text-primary" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                No events found. Create one using the form above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Schedule</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th className="text-center">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {events.map((event) => (
                      <Table.Tr key={event._id}>
                        <Table.Td>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-slate-500">
                            {event.location || "No location"}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <div className="text-sm font-medium">
                            {formatDisplayDate(event.startDate)}
                            {" – "}
                            {formatDisplayDate(event.endDate)}
                          </div>
                          {!event.isAllDay && (
                            <div className="text-xs text-slate-500">
                              {event.startTime || "--"} &bull; {event.endTime || "--"}
                            </div>
                          )}
                        </Table.Td>
                        <Table.Td className="text-sm capitalize">
                          {event.eventType}
                        </Table.Td>
                        <Table.Td>
                          <FormSelect
                            className="w-36"
                            value={event.status}
                            onChange={(e) => handleStatusUpdate(event._id, e.target.value)}
                            disabled={statusUpdating === event._id}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </FormSelect>
                        </Table.Td>
                        <Table.Td className="text-center">
                          <div className="flex items-center justify-center space-x-3">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => {
                                setEventToDelete(event);
                                setShowDeleteDialog(true);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Notification getRef={(el) => (notify.current = el)}>
        <div className="font-medium">{success ? "Success" : "Error"}</div>
        <div className="mt-1 text-slate-500">{message}</div>
      </Notification>

      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <Dialog.Panel className="p-5">
          <div className="text-lg font-semibold mb-3">Delete Event</div>
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{eventToDelete?.title}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline-secondary" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default EventsPage;

