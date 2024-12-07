/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, Coins, Leaf, Search, Bell, User, ChevronDown, LogIn } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import {
  createUser,
  getUnreadNotifications,
  markNotificationAsRead,
  getUserByEmail,
  getUserBalance,
} from "@/utils/db/actions";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

interface HeaderProps {
  onMenuClick: () => void;
  totalEarnings: number;
}

interface Notification {
  id: number;
  type: string;
  message: string;
}

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 468px)");

  // Clerk User State
  const { isSignedIn, user } = useUser();

  // Local state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);

  // Create user in the database if not exists
  useEffect(() => {
    const handleUserLogin = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        const email = user.emailAddresses[0].emailAddress;
        const dbUser = await getUserByEmail(email);

        if (!dbUser) {
          await createUser(email, `${user.firstName || ""} ${user.lastName || ""}`.trim());
        }
      }
    };

    if (isSignedIn) {
      handleUserLogin();
    }
  }, [isSignedIn, user]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        const dbUser = await getUserByEmail(user.emailAddresses[0].emailAddress);
        if (dbUser) {
          const unreadNotifications = await getUnreadNotifications(dbUser.id);
          setNotifications(unreadNotifications);
        }
      }
    };

    if (isSignedIn) {
      fetchNotifications();
      const notificationInterval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(notificationInterval);
    }
  }, [isSignedIn, user]);

  // Fetch user balance
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (user?.emailAddresses[0]?.emailAddress) {
        const dbUser = await getUserByEmail(user.emailAddresses[0].emailAddress);
        if (dbUser) {
          const userBalance = await getUserBalance(dbUser.id);
          setBalance(userBalance);
        }
      }
    };

    if (isSignedIn) fetchUserBalance();
  }, [isSignedIn, user]);

  // Handle notification click
  const handleNotificationClick = async (notificationId: number) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== notificationId)
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left Section */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-gray-800">
                Zero2Hero
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
                ETHOnline24
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section */}
        {!isMobile && (
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2">
              <Search className="h-5 w-5" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {notification.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {notification.message}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>
                  No new notifications
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">
              {balance.toFixed(2)}
            </span>
          </div>
          {!isSignedIn ? (
            <SignInButton>
              <Button className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
                Login
                <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </SignInButton>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex items-center"
                >
                  <User className="h-5 w-5 mr-1" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {user?.firstName || "Anonymous User"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <span>Sign Out</span>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
