// NewTweet.tsx

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import type { User } from "@supabase/auth-helpers-nextjs";

// If you have a proper Database type, replace 'any' with your type.
type Database = any;

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: { user: User }) {
  // This server action will be executed when the form is submitted.
  const addTweet = async (formData: FormData) => {
    "use server";
    try {
      // Retrieve the title from the form data.
      const title = String(formData.get("title"));
      if (!title || title.trim() === "") {
        throw new Error("Tweet content cannot be empty.");
      }

      // Create a Supabase client for server actions.
      const supabase = createServerActionClient<Database>({ cookies });

      // Attempt to insert the new tweet.
      const { error } = await supabase
        .from("tweets")
        .insert({ title, user_id: user.id });

      if (error) {
        console.error("Error inserting tweet:", error);
        throw new Error("Error inserting tweet.");
      }

      console.log("Tweet inserted successfully!");
      // Optionally: You can return a value or trigger a revalidation if needed.
    } catch (error) {
      console.error("Error in addTweet:", error);
      // Rethrow error so that Next.js knows the action failed.
      throw error;
    }
  };

  return (
    <form
      className="border border-t-0 border-gray-800"
      action={addTweet}
    >
      <div className="flex items-center px-4 py-8">
        <div className="w-12 h-12">
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
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
