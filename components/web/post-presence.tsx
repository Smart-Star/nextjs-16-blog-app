"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import FacePile from "@convex-dev/presence/facepile";
import usePresence from "@convex-dev/presence/react";

type PostPresenceInnerType = {
  roomId: Id<"post">;
  userId: string;
};

export const PostPresence = ({ roomId }: { roomId: Id<"post"> }) => {
  const userId = useQuery(api.presence.getUserId);

  if (!userId) return null;

  return <PostPresenceInner roomId={roomId} userId={userId} />;
};

const PostPresenceInner = ({ roomId, userId }: PostPresenceInnerType) => {
  const presenceState = usePresence(api.presence, roomId, userId);

  if (!presenceState || presenceState.length === 0) return null;

  return (
    <div className='flex items-center gap-2'>
      <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
        Viewing now
      </p>
      <div className='text-black'>
        <FacePile presenceState={presenceState} />
      </div>
    </div>
  );
};
