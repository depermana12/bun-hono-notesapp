import { trpc } from "../utils/trpc";

const Home = () => {
  const { data } = trpc.user.getUser.useQuery({ id: 4 });
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100">
      {data?.data[0].name}
    </div>
  );
};
export default Home;
