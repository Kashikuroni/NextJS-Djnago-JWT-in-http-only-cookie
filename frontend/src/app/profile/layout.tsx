"use client";
import TextGradient from "@/components/ui/GradientText/GradientText";
import { useAuth } from "@/context/AuthProvider";
import { LuLoaderCircle } from "react-icons/lu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex flex-col h-screen text-blue-400 font-bold justify-center items-center">
  //       <LuLoaderCircle className="w-32 h-32  animate-spin" />
  //       <span className="text-2xl">
  //         <TextGradient
  //           from="from-blue-500"
  //           via="via-purple-500"
  //           to="to-pink-500"
  //         >
  //           Loading...
  //         </TextGradient>
  //       </span>
  //     </div>
  //   );
  // }
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <div className="flex bg-white border justify-center items-center border-gray-300 px-10 py-5 rounded-3xl">
        {children}
      </div>
    </div>
  );
}
