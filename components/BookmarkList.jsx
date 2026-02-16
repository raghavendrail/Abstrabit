"use client";
import { supabase } from "../lib/supabaseClient";

export default function BookmarkList({ bookmarks, setBookmarks }) {

  const deleteBookmark = async (id) => {
    // Optimistic UI update
    setBookmarks((prev) => prev.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
    }
  };

  const updateBookmark = async (id, currentTitle) => {
    const newTitle = prompt("Enter new title", currentTitle);
    if (!newTitle) return;

    // Optimistic UI update
    setBookmarks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item
      )
    );

    const { error } = await supabase
      .from("bookmarks")
      .update({ title: newTitle })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div>
      {bookmarks?.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border p-3 mb-2 flex justify-between"
        >
          <a href={bookmark.url} target="_blank">
            {bookmark.title}
          </a>

          <div>
            <button
              onClick={() => updateBookmark(bookmark.id, bookmark.title)}
              className="text-blue-600 mr-4"
            >
              Edit
            </button>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
