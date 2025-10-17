import { useState, useEffect } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, Filter, X } from "lucide-react";
import { useEventsData, useEventsManagement } from "../hooks/useApiData";

// Date utility functions
const formatDate = (date: Date, formatString: string): string => {
  if (formatString === 'MMM d, yyyy') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  if (formatString === 'EEEE, MMMM d, yyyy') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  return date.toLocaleDateString();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'conference' | 'workshop' | 'networking' | 'demo' | 'pitch' | 'mentoring';
  attendees: number;
  maxAttendees?: number;
  organizer: string;
  speakers?: string[];
}

interface EventsPageProps {
  isAdmin?: boolean;
}

const eventTypes = {
  conference: { label: 'Conference', color: 'bg-purple-500 text-white' },
  workshop: { label: 'Workshop', color: 'bg-secondary text-white' },
  networking: { label: 'Networking', color: 'bg-accent text-black' },
  demo: { label: 'Demo Day', color: 'bg-red-500 text-white' },
  pitch: { label: 'Pitch Session', color: 'bg-primary text-white' },
  mentoring: { label: 'Mentoring', color: 'bg-green-500 text-white' }
};

export function EventsPage({ isAdmin = false }: EventsPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Utiliser les hooks toujours (règle des hooks React)
  const eventsManagement = useEventsManagement();
  const { events: apiEvents } = useEventsData();

  // Convert API events to the internal format with Date objects
  const convertedEvents: Event[] = apiEvents.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: new Date(event.date),
    time: event.time,
    location: event.location,
    type: event.type as Event['type'],
    attendees: event.currentAttendees || 0,
    maxAttendees: event.maxAttendees,
    organizer: 'JEB Team',
    speakers: event.speakers
  }));

  const [events, setEvents] = useState<Event[]>(convertedEvents);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'workshop' as Event['type'],
    maxAttendees: ''
  });

  // Calculate selected events for the selected date
  const selectedEvents = selectedDate ? events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  }) : [];

  // Effect to update events when API data changes
  useEffect(() => {
    setEvents(convertedEvents);
  }, [apiEvents]);

  // Filter events based on selected date and type
  useEffect(() => {
    if (selectedDate) {
      // Events are filtered in real-time in getEventsForDate function
    }
  }, [selectedDate, events, filterType]);

  const getEventsForDate = (checkDate: Date) => {
    return events.filter(event => 
      isSameDay(event.date, checkDate) &&
      (filterType === 'all' || event.type === filterType)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdmin && eventsManagement) {
      // Pour les admins, utiliser l'API pour créer l'événement
      try {
        await eventsManagement.createEvent({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          type: formData.type,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined
        });
        
        // Réinitialiser le formulaire
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          type: 'workshop',
          maxAttendees: ''
        });
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Erreur lors de la création de l\'événement');
      }
    } else {
      // Pour les non-admins, comportement local (lecture seule)
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        time: formData.time,
        location: formData.location,
        type: formData.type,
        attendees: 0,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        organizer: 'You'
      };

      setEvents([...events, newEvent]);
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'workshop',
        maxAttendees: ''
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (isAdmin && eventsManagement) {
      // Pour les admins, utiliser l'API pour supprimer l'événement
      try {
        await eventsManagement.deleteEvent(eventId);
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    } else {
      // Pour les non-admins, comportement local
      setEvents(events.filter(e => e.id !== eventId));
      setSelectedEvent(null);
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const getEventTypeStats = () => {
    const stats = Object.keys(eventTypes).map(type => ({
      type,
      count: events.filter(e => e.type === type).length,
      label: eventTypes[type as keyof typeof eventTypes].label
    }));
    return stats.filter(s => s.count > 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="mb-2">Events Calendar</h1>
            <p className="text-muted-foreground">
              Discover workshops, pitch sessions, and networking events
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* View Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="px-4"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-4"
              >
                <Users className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            {/* Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {Object.entries(eventTypes).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add Event Button */}
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Add a new event to the calendar
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="type">Event Type</Label>
                          <Select value={formData.type} onValueChange={(value: Event['type']) => setFormData({ ...formData, type: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(eventTypes).map(([type, config]) => (
                                <SelectItem key={type} value={type}>
                                  {config.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="maxAttendees">Max Attendees</Label>
                          <Input
                            id="maxAttendees"
                            type="number"
                            value={formData.maxAttendees}
                            onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Event</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => {
                  const now = new Date();
                  return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {events.filter(e => e.date > new Date()).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {getEventTypeStats().slice(0, 3).map(stat => (
                  <Badge key={stat.type} variant="secondary" className="text-xs">
                    {stat.count} {stat.type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>
                    Click on a date to view events for that day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                    modifiers={{
                      hasEvents: (date) => getEventsForDate(date).length > 0,
                      today: (date) => isToday(date)
                    }}
                    modifiersStyles={{
                      hasEvents: { 
                        backgroundColor: 'var(--primary)', 
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    All upcoming events in chronological order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUpcomingEvents().map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{event.title}</h4>
                            <Badge className={eventTypes[event.type].color}>
                              {eventTypes[event.type].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDate(event.date, 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Sidebar */}
          <div className="space-y-6">
            {/* Selected Date Events */}
            {viewMode === 'calendar' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Events for {selectedDate ? formatDate(selectedDate, 'MMM d, yyyy') : 'Today'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{event.title}</h5>
                            <Badge className={eventTypes[event.type].color} variant="secondary">
                              {eventTypes[event.type].label}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees}{event.maxAttendees && ` / ${event.maxAttendees}`} attendees
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No events scheduled for this date
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getEventTypeStats().map((stat) => (
                    <div key={stat.type} className="flex items-center justify-between">
                      <span className="text-sm">{stat.label}</span>
                      <Badge variant="outline">{stat.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    {selectedEvent.title}
                    <Badge className={eventTypes[selectedEvent.type].color}>
                      {eventTypes[selectedEvent.type].label}
                    </Badge>
                  </DialogTitle>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <DialogDescription>
                  Event details and information for {formatDate(selectedEvent.date, 'MMM d, yyyy')} at {selectedEvent.time}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedEvent.date, 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedEvent.attendees} attendees
                        {selectedEvent.maxAttendees && ` (max: ${selectedEvent.maxAttendees})`}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Organizer: </span>
                      <span>{selectedEvent.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                {!isAdmin && selectedEvent.maxAttendees && selectedEvent.attendees < selectedEvent.maxAttendees && (
                  <Button variant="default">
                    Register for Event
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}