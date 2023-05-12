import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-lg shadow-lg"
        src="/demo.mp4"
      ></video>
    </>
  );
}
