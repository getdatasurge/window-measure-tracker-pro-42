
export interface Project {
  id: number;
  name: string;
  color: string;
  client: string;
  location: string;
  windows: number;
  progress: number;
  deadline: string;
  status: string;
}

export const activeProjects: Project[] = [
  {
    id: 1,
    name: 'Lakeside Residence',
    color: 'blue',
    client: 'John & Mary Smith',
    location: 'Bellevue, WA',
    windows: 24,
    progress: 75,
    deadline: 'Jun 30, 2025',
    status: 'In Progress'
  },
  {
    id: 2,
    name: 'Downtown Office Complex',
    color: 'purple',
    client: 'Axis Commercial Properties',
    location: 'Seattle, WA',
    windows: 186,
    progress: 25,
    deadline: 'Aug 15, 2025',
    status: 'Just Started'
  },
  {
    id: 3,
    name: 'Harbor View Apartments',
    color: 'orange',
    client: 'Emerald Bay Management',
    location: 'Tacoma, WA',
    windows: 94,
    progress: 60,
    deadline: 'Jul 10, 2025',
    status: 'Needs Review'
  },
  {
    id: 4,
    name: 'Sunnyvale Residence',
    color: 'red',
    client: 'Robert & Lisa Anderson',
    location: 'Kirkland, WA',
    windows: 18,
    progress: 90,
    deadline: 'Jun 25, 2025',
    status: 'Final Check'
  },
  {
    id: 5,
    name: 'Westlake Tower',
    color: 'green',
    client: 'Summit Properties LLC',
    location: 'Seattle, WA',
    windows: 132,
    progress: 40,
    deadline: 'Jul 30, 2025',
    status: 'In Progress'
  }
];
  
export const upcomingProjects: Project[] = [
  {
    id: 6,
    name: 'Emerald Heights Condos',
    color: 'blue',
    client: 'Evergreen Developers',
    location: 'Redmond, WA',
    windows: 78,
    progress: 0,
    deadline: 'Jul 15, 2025',
    status: 'Scheduled'
  },
  {
    id: 7,
    name: 'Cascade Business Center',
    color: 'green',
    client: 'Northwest Commercial Group',
    location: 'Bellevue, WA',
    windows: 210,
    progress: 0,
    deadline: 'Aug 5, 2025',
    status: 'Contract Signed'
  },
  {
    id: 8,
    name: 'Oakridge Manor',
    color: 'pink',
    client: 'James & Patricia Wilson',
    location: 'Sammamish, WA',
    windows: 32,
    progress: 0,
    deadline: 'Jul 8, 2025',
    status: 'Pre-Assessment'
  }
];
