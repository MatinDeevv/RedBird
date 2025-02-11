import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from "next/image";

import type { User } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });

    await supabase.from("tweets").insert({ title, user_id: user.id });
  };

  return (
    <form className="border border-t-0 border-gray-800" action={addTweet}>
      <div className="flex px-4 py-8">
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
      </div>
    </form>
  );
}
