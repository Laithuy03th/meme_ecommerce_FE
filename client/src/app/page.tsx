import ProductList from "@/components/ProductList";

import BannerSlider from "@/components/BannerSlider";
const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
const bannerImages = [
    '/featured.jpg',
    '/banner2.jpg',
    '/banNer.jpg',
  ];

  return (
    <div className="container mx-auto px-4"> {/* Thêm container và padding */}
      <div className="my-14"> {/* Khoảng cách trên dưới cho slider */}
        <BannerSlider images={bannerImages} />
      </div>

      <ProductList category={category} params="homepage"/>
    </div>
  );
};

export default Homepage;
