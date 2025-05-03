
import React from 'react';

const Schedule = () => {
  const currentDay = new Date().getDate();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  
  // Generate days of the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Generate calendar events
  const events = [
    {
      id: 1,
      name: 'Lakeside Residence',
      type: 'Measurements',
      team: 'Sarah Johnson',
      date: '24',
      time: '9:00 AM - 12:00 PM',
      status: 'scheduled'
    },
    {
      id: 2,
      name: 'Sunnyvale Residence',
      type: 'Installation',
      team: 'Installation Team',
      date: '25',
      time: '10:30 AM - 4:00 PM',
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'Downtown Office Complex',
      type: 'Measurements - Floor 13',
      team: 'David Wilson, Michael Brown',
      date: '27',
      time: '8:00 AM - 3:00 PM',
      status: 'confirmed'
    },
    {
      id: 4,
      name: 'Harbor View Apartments',
      type: 'Measurements - Building C',
      team: 'Emma Chen',
      date: '30',
      time: '9:30 AM - 3:30 PM',
      status: 'pending'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">{currentMonth} Schedule</h2>
            <p className="text-sm text-gray-500">Team scheduling and appointments</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="px-3 py-1.5 border rounded text-gray-700 hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="px-4 py-2 bg-wintrack-dark-blue text-white rounded-md text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Event
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">Today</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">Day</button>
          <button className="px-4 py-2 bg-wintrack-green text-white rounded-md text-sm font-medium">Week</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">Month</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">List</button>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 auto-rows-fr">
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = i - 3 + 1; // Adjust for starting day of month
                const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                const isToday = dayNumber === currentDay;
                const dayEvents = events.filter(event => event.date === dayNumber.toString());
                
                return (
                  <div 
                    key={i} 
                    className={`border rounded min-h-[100px] p-1 ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'border-wintrack-green' : 'border-gray-200'}`}
                  >
                    <div className={`text-right p-1 ${
                      isToday ? 'bg-wintrack-green text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''
                    }`}>
                      {isCurrentMonth ? dayNumber : ''}
                    </div>
                    
                    {isCurrentMonth && dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        className={`my-1 p-1 text-xs rounded ${
                          event.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : event.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <div className="font-medium">{event.name}</div>
                        <div>{event.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <button className="text-sm text-blue-600 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex border-b pb-4 last:border-0">
                <div className="w-16 h-16 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center text-xs font-medium flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-bold">{event.date}</div>
                    <div>Jun</div>
                  </div>
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="font-medium">{event.name}</div>
                  <div className="text-sm text-gray-600">{event.type}</div>
                  <div className="text-xs text-gray-500 mt-1">{event.time} • {event.team}</div>
                </div>
                
                <div className="flex items-start gap-2 ml-4">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5v14M5 12h14" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Team Availability</h2>
            <button className="text-sm text-blue-600 font-medium">Manage</button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Team Alpha</div>
                    <div className="text-xs text-gray-500">Commercial Installations</div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
              </div>
              
              <div className="ml-12 mt-2 space-y-1">
                <div className="flex items-center">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Michael Brown" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">Michael Brown</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-auto">Available</span>
                </div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="John Davis" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">John Davis</span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full ml-auto">On leave</span>
                </div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="James Wilson" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">James Wilson</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-auto">On site</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Team Beta</div>
                    <div className="text-xs text-gray-500">Residential Installations</div>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">On site</span>
              </div>
              
              <div className="ml-12 mt-2 space-y-1">
                <div className="flex items-center">
                  <img src="/lovable-uploads/f1ba8f91-019b-4932-9d0e-5414aef0ed47.png" alt="Sarah Johnson" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">Sarah Johnson</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-auto">On site</span>
                </div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/1147f83d-d82c-4ab7-a3de-51400ce914c1.png" alt="Emma Chen" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">Emma Chen</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full ml-auto">On site</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Team Gamma</div>
                    <div className="text-xs text-gray-500">Mixed Installations</div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
              </div>
              
              <div className="ml-12 mt-2 space-y-1">
                <div className="flex items-center">
                  <img src="/lovable-uploads/211d8c12-4057-4c0f-80e4-5191abc30c81.png" alt="David Wilson" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">David Wilson</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-auto">Available</span>
                </div>
                <div className="flex items-center">
                  <img src="/lovable-uploads/e9f29315-c127-4c60-97d6-bc6eb6936a7a.png" alt="Thomas Lee" className="w-5 h-5 rounded-full mr-2" />
                  <span className="text-sm">Thomas Lee</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-auto">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Schedule New Appointment</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select className="search-input">
                <option>Measurement</option>
                <option>Installation</option>
                <option>Quality Check</option>
                <option>Client Meeting</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select className="search-input">
                <option>Lakeside Residence</option>
                <option>Downtown Office Complex</option>
                <option>Harbor View Apartments</option>
                <option>Sunnyvale Residence</option>
                <option>New Project</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
              <select className="search-input" multiple size={3}>
                <option>Michael Brown</option>
                <option>Sarah Johnson</option>
                <option>David Wilson</option>
                <option>Emma Chen</option>
                <option>Thomas Lee</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="search-input min-h-[100px]" placeholder="Add any additional details or notes..."></textarea>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="search-input" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input type="time" className="search-input" />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input type="time" className="search-input" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" className="search-input" placeholder="Enter address or location" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Contact</label>
              <input type="text" className="search-input" placeholder="Client name or contact information" />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Send notification to team</span>
              </label>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-700">Send confirmation to client</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 bg-wintrack-green hover:bg-wintrack-green-dark text-white rounded">
            Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
