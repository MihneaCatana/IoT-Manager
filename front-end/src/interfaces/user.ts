export interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  profileImage: string;
  city?: string;
  country?: string;
  zip?: string;
}
