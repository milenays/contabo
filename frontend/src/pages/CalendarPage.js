import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay, isToday, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit, Trash, DollarSign, Calendar, Briefcase, Gift } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { createEvent, getEvents, updateEvent, deleteEvent } from '../api/calendarApi';
import { useToast } from "../components/ui/use-toast";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data.map(event => ({
        ...event,
        date: new Date(event.date)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);  // Reset selected event
    setIsDialogOpen(true);
  };

  const handleEventSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const eventData = {
      title: formData.get('title'),
      date: selectedDate.toISOString(),
      type: formData.get('type'),
      description: formData.get('description'),
    };

    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, eventData);
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        await createEvent(eventData);
        toast({ title: "Success", description: "Event created successfully" });
      }
      fetchEvents();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      fetchEvents();
      toast({ title: "Success", description: "Event deleted successfully" });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = monthStart;
    const endDate = monthEnd;

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(new Date(event.date), cloneDay));
        days.push(
          <div
            key={day}
            className={`border p-2 h-32 overflow-y-auto cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 ${
              !isSameMonth(day, monthStart)
                ? "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                : isToday(day)
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                : "bg-white dark:bg-gray-800"
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className={`float-right text-sm font-semibold ${
              isToday(day) ? "text-blue-800 dark:text-blue-200" : ""
            }`}>{formattedDate}</span>
            {dayEvents.map((event, idx) => (
              <div key={idx} className={`text-xs p-1 mb-1 rounded flex items-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
                <span className="ml-1 truncate">{event.title}</span>
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4">{rows}</div>;
  };

  const getEventColor = (type) => {
    const colors = {
      payment: "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200",
      meeting: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
      holiday: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200",
      other: "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
    };
    return colors[type] || colors.other;
  };

  const getEventIcon = (type) => {
    const icons = {
      payment: <DollarSign className="h-3 w-3" />,
      meeting: <Briefcase className="h-3 w-3" />,
      holiday: <Gift className="h-3 w-3" />,
      other: <Calendar className="h-3 w-3" />
    };
    return icons[type] || icons.other;
  };

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
        <div className="space-x-2">
          <Button onClick={handlePrevMonth} variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={handleNextMonth} variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-sm py-2">{day}</div>
        ))}
      </div>
      {renderCalendar()}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-lg">Events:</h3>
            {events
              .filter(event => selectedDate && isSameDay(new Date(event.date), selectedDate))
              .map((event, idx) => (
                <div key={idx} className={`p-3 mb-3 rounded ${getEventColor(event.type)}`}>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center font-medium">
                      {getEventIcon(event.type)}
                      <span className="ml-2">{event.title}</span>
                    </span>
                    <div className="space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(event._id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{event.description}</p>
                </div>
              ))}
          </div>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="block mb-1">Title</Label>
              <Input id="title" name="title" defaultValue={selectedEvent?.title} required className="w-full" />
            </div>
            <div>
              <Label htmlFor="type" className="block mb-1">Type</Label>
              <Select name="type" defaultValue={selectedEvent?.type || 'other'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="block mb-1">Description</Label>
              <Input id="description" name="description" defaultValue={selectedEvent?.description} className="w-full" />
            </div>
            <Button type="submit" className="w-full">
              {selectedEvent ? 'Update' : 'Create'} Event
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;