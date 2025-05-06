
export interface ActivityItem {
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  project: string;
  time: string;
  status: string;
}
