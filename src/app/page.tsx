"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/Authcontext";
import LoginPage from "@/components/login";

const Home = () => {
  const { isAuthenticated, accessToken, setAccessToken } = useAuth();
  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Social Media Platform</h1>
      {!isAuthenticated ? (
        <div>
          {/* <h2 className="text-xl font-semibold">Please Log In</h2>
          <p className="text-gray-600">You need to log in to access the platform</p>
          <Link href="/login">
            <a className="text-blue-500">Login</a>
          </Link> */}
          <LoginPage/>
        </div>
      ) : (
        <div className="grid gap-4">
          <Link href="/feed" className="p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <h2 className="text-xl font-semibold">Feed</h2>
            <p className="text-gray-600">View real-time posts as they are created</p>
          </Link>
          <Link href="/trending" className="p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <h2 className="text-xl font-semibold">Trending Posts</h2>
            <p className="text-gray-600">Posts with the most comments</p>
          </Link>
          <Link href="/top-users" className="p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <h2 className="text-xl font-semibold">Top 5 Users</h2>
            <p className="text-gray-600">Most active users on the platform</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
