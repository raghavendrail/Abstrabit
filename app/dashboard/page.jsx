"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import BookmarkForm from "../../components/BookmarkForm";
import BookmarkList from "../../components/BookmarkList";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  console.log("User in Dashboard:", user);
  const [bookmarks, setBookmarks] = useState([]);
useEffect(() => {
  let channel;

  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/";
      return;
    }

    setUser(session.user);
    fetchBookmarks(session.user.id);

    channel = subscribeRealtime(session.user.id);
  };

  init();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      window.location.href = "/";
    } else {
      setUser(data.user);
      fetchBookmarks(data.user.id);
      subscribeRealtime(data.user.id);
    }
  };

  const fetchBookmarks = async (userId) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data);
  };
const subscribeRealtime = (userId) => {
  const channel = supabase
    .channel("bookmarks-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("Realtime event:", payload);

        if (payload.eventType === "INSERT") {
          setBookmarks((prev) => [payload.new, ...prev]);
        }

        if (payload.eventType === "DELETE") {
          setBookmarks((prev) =>
            prev.filter((item) => item.id !== payload.old.id)
          );
        }

        if (payload.eventType === "UPDATE") {
          setBookmarks((prev) =>
            prev.map((item) =>
              item.id === payload.new.id ? payload.new : item
            )
          );
        }
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status);
    });

  return channel;
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                <path d="M13 13a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">BookmarkHub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.user_metadata?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-slate-600 font-semibold transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Bookmarks</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{bookmarks?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Recent Activity</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">Active</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Quick Access</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">Ready</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Form and List */}
        <BookmarkForm user={user} />
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Your Bookmarks</h2>
          <BookmarkList 
            bookmarks={bookmarks} 
            setBookmarks={setBookmarks} 
          />
        </div>
      </main>
    </div>
  );
}
