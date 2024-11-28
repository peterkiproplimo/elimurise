import ContentLoader from "react-content-loader";

function CardLoader() {
  return (
    // <ContentLoader
    //   speed={2}
    //   width={300}
    //   height={150}
    //   viewBox="0 0 300 150"
    //   backgroundColor="#c9ddf2"
    //   foregroundColor="#ecebeb"
    // >
    //   <rect x="10" y="10" rx="4" ry="4" width="280" height="20" />
    //   <rect x="10" y="40" rx="4" ry="4" width="200" height="20" />
    //   <rect x="10" y="70" rx="4" ry="4" width="250" height="20" />
    //   <rect x="10" y="100" rx="4" ry="4" width="300" height="20" />
    // </ContentLoader>

    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 1000 600"
      backgroundColor="#ebeced"
      foregroundColor="#bfbdbd"
    >
      {/* Dashboard Cards */}
      <rect x="10%" y="20" rx="4" ry="4" width="15%" height="120" />
      <rect x="28%" y="20" rx="4" ry="4" width="15%" height="120" />
      <rect x="46%" y="20" rx="4" ry="4" width="15%" height="120" />
      <rect x="64%" y="20" rx="4" ry="4" width="15%" height="120" />
      <rect x="82%" y="20" rx="4" ry="4" width="15%" height="120" />

      {/* Main Content Rows */}
      <rect x="10%" y="180" rx="4" ry="4" width="35%" height="320" />
      <rect x="55%" y="180" rx="4" ry="4" width="35%" height="320" />
    </ContentLoader>
  );
}
export default CardLoader;
