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
    <div className="mb-4">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={addBookmark}
        className="bg-green-600 text-white px-4 py-2"
      >
        Add
      </button>
    </div>
  );
}
