import { HomeLayout } from "@/app/modules/home/ui/layout/home-layout";


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
