"use client";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white border border-gray-300 px-10 py-5 rounded-3xl">
        {children}
      </div>
    </div>
  );
}
