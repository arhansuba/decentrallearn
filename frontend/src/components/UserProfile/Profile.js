import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../services/api';
import ProgressTracker from './ProgressTracker';

const Profile = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const fetchedProfile = await fetchUserProfile(userId);
      setProfile(fetchedProfile);
    };
    loadProfile();
  }, [userId]);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      <h2>{profile.name}'s Profile</h2>
      <img src={profile.avatar} alt={`${profile.name}'s avatar`} />
      <p>Email: {profile.email}</p>
      <p>Joined: {new Date(profile.joinDate).toLocaleDateString()}</p>
      <p>Courses Completed: {profile.completedCourses}</p>
      <p>Tokens Earned: {profile.tokens}</p>
      <ProgressTracker userId={userId} />
    </div>
  );
};

export default Profile;