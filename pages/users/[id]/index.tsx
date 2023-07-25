import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div>user {id}</div>;
};

export default UserPage;
