import { trpc } from "../utils/trpc";

const Home = () => {
  const userQuery = trpc.user.getUser.useQuery({ id: 4 });
  return <div>{userQuery.data?.data[0].name}</div>;
};
export default Home;
