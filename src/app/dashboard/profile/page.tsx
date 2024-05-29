import { auth } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  console.log(session);

  return (
    <div>
      <h1>{JSON.stringify({ session })}</h1>
    </div>
  );
}
