// NewTweet.tsx

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";
import type { User } from "@supabase/auth-helpers-nextjs";

// If you have a Database type defined, import it. Otherwise, use `any` temporarily.
type Database = any;

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: { user: User }) {
  // This function will be executed on the server when the form is submitted.
  const addTweet = async (formData: FormData) => {
    "use server";

    try {
      // Retrieve the title value from the form data.
      const title = String(formData.get("title"));
      if (!title) {
        throw new Error("Title is required");
      }

      // Create a Supabase client instance for server actions.
      const supabase = createServerActionClient<Database>({ cookies });

      // Insert a new tweet into the "tweets" table.
      const { error } = await supabase
        .from("tweets")
        .insert({ title, user_id: user.id });

      if (error) {
        console.error("Error inserting tweet:", error);
        throw new Error("Error inserting tweet");
      }

      // Optionally, you could return a success message or perform additional actions.
      console.log("Tweet successfully inserted!");
    } catch (err) {
      console.error("Error in addTweet:", err);
      // You can rethrow the error if you need it to propagate or handle it gracefully.
      throw err;
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
