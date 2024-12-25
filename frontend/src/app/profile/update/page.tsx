"use server";
import React from "react";
import dynamic from "next/dynamic";
const DynamicProfileForm = dynamic(
  () => import("@/components/Forms/Profile/ProfileForm"),
);

const UpdateProfilePage: React.FC = () => {
  return (
    <>
      <DynamicProfileForm />
    </>
  );
};

export default UpdateProfilePage;
