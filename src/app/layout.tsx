'use client'
import { DM_Sans } from "next/font/google"
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/global/Sidebar";
import Header from "@/components/global/Header";
import { useState } from "react";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
})



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [totalEarnings, setTotalEarnings] = useState(0)

  // useEffect(() => {
  //   const fetchTotalEarnings = async () => {
  //     try {
  //       const userEmail = localStorage.getItem('userEmail')
  //       if (userEmail) {
  //         const user = await getUserByEmail(userEmail)
  //         console.log('user from layout', user);
          
  //         if (user) {
  //           const availableRewards = await getAvailableRewards(user.id) as any
  //           console.log('availableRewards from layout', availableRewards);
  //                       setTotalEarnings(availableRewards)
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching total earnings:', error)
  //     }
  //   }

  //   fetchTotalEarnings()
  // }, [])


  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${sans.className} antialiased`}
        >
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} totalEarnings={totalEarnings} /> */}
            <Header />
            <div className="flex flex-1">
              <Sidebar open={sidebarOpen} />
              <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
                {children}
              </main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>

  );
}
