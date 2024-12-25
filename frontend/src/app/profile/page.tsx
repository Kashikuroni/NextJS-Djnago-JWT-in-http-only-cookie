import React from "react";
import dynamic from "next/dynamic";

const DynamicUserProfile = dynamic(
  () => import("@/components/Profile/UserProfile"),
);

const UserProfilePage: React.FC = () => {
  return <DynamicUserProfile />;
};

export default UserProfilePage;
