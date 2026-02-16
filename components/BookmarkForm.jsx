"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkForm({ user }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

const addBookmark = async () => {
  if (!title || !url) return;

  const { error } = await supabase.from("bookmarks").insert([
    {
      title,
      url,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    alert("Error adding bookmark");
    return;
  }

  setTitle("");
  setUrl("");
};



  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-lg p-6 border border-blue-100 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Add New Bookmark</h2>
        <div className="space-y-3">
          <input
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <input
            placeholder="URL (https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={addBookmark}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
          >
            + Add Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}
