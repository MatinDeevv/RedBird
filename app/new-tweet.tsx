// NewTweet.tsx
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import type { User } from "@supabase/auth-helpers-nextjs";

// If you have a proper Database type, replace `any` with your type.
type Database = any;

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: { user: User }) {
  // This function will be executed on the server when the form is submitted.
  const addTweet = async (formData: FormData) => {
    "use server";
    try {
      // Extract and validate the tweet content.
      const title = String(formData.get("title"));
      if (!title || title.trim() === "") {
        throw new Error("Tweet content cannot be empty.");
      }

      // Ensure the user is authenticated.
      if (!user?.id) {
        throw new Error("User is not authenticated.");
      }

      // Create the Supabase client using server-side cookies.
      const supabase = createServerActionClient<Database>({ cookies });

      // Insert the tweet into the "tweets" table.
      const { error } = await supabase
        .from("tweets")
        .insert({ title, user_id: user.id });

      if (error) {
        console.error("Supabase insertion error:", error);
        throw new Error("Failed to insert tweet.");
      }

      console.log("Tweet successfully inserted!");
      // Optionally, you can return a value or trigger a revalidation.
    } catch (err) {
      console.error("Error in addTweet:", err);
      // Rethrow the error to let Next.js know the action failed.
      throw err;
    }
  };

  return (
    <form action={addTweet} className="border border-t-0 border-gray-800">
      <div className="flex items-center px-4 py-8">
        <div className="w-12 h-12">
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="user avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            // Fallback if no avatar is provided.
            <div className="w-12 h-12 bg-gray-300 rounded-full" />
          )}
        </div>
        <input
          name="title"
          className="flex-1 px-2 ml-2 text-2xl leading-loose placeholder-gray-500 bg-inherit"
          placeholder="What is happening?!"
        />
        <button
          type="submit"
          className="px-4 py-2 ml-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Tweet
        </button>
      </div>
    </form>
  );
}
