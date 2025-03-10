import { StudioLayout } from './../../modules/studio/ui/layouts/studio-layout';

interface StudioLayoutPros{
  children:React.ReactNode;
}
const Layout = ({children}:StudioLayoutPros) => {
  return (
    <StudioLayout
    >
      {children}
    </StudioLayout>
  );
};

export default Layout;
