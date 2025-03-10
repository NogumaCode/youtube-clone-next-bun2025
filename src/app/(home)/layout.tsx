import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";



interface LayoutPros{
  children:React.ReactNode;
}
const Layout = ({children}:LayoutPros) => {
  return (
    <HomeLayout
    >
      {children}
    </HomeLayout>
  );
};

export default Layout;
