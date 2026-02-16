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


  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">My Bookmarks</h1>
      <BookmarkForm user={user} />
      <BookmarkList 
  bookmarks={bookmarks} 
  setBookmarks={setBookmarks} 
/>

    </div>
  );
}
