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
      {bookmarks?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No bookmarks yet. Add your first bookmark above!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookmarks?.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500"
            >
              <div className="flex-1 min-w-0">
                <a 
                  href={bookmark.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 break-words transition-colors"
                >
                  {bookmark.title}
                </a>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate">
                  {bookmark.url}
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3 justify-end">
                <button
                  onClick={() => updateBookmark(bookmark.id, bookmark.title)}
                  className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="px-4 py-2 rounded-lg bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
