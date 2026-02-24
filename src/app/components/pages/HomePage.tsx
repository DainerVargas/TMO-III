import { useRef, useCallback, useEffect } from "react";
import { HeroSection } from "../HeroSection";
import { PromoSection } from "../PromoSection";
import { CategorySection } from "../CategorySection";
import { Catalog } from "../Catalog";
import { AboutSection } from "../AboutSection";
import { Footer } from "../Footer";
import { useOutletContext } from "react-router";
import type { LayoutContextType } from "../Layout";

export function HomePage() {
  const {
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    handleAddToCart,
    setSelectedProduct,
    scrollToCatalogFlag,
    clearScrollFlag,
  } = useOutletContext<LayoutContextType>();

  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      setSelectedCategory(categoryId);
      setSearchQuery("");
      setTimeout(() => scrollToCatalog(), 100);
    },
    [setSelectedCategory, setSearchQuery, scrollToCatalog]
  );

  // Scroll to catalog when triggered from Header on another page
  useEffect(() => {
    if (scrollToCatalogFlag) {
      setTimeout(() => scrollToCatalog(), 150);
      clearScrollFlag();
    }
  }, [scrollToCatalogFlag, clearScrollFlag, scrollToCatalog]);

  return (
    <>
      <main className="flex-1">
        <HeroSection onScrollToCatalog={scrollToCatalog} />
        <PromoSection onScrollToCatalog={scrollToCatalog} />
        <CategorySection
          onCategorySelect={handleCategorySelect}
          onScrollToCatalog={scrollToCatalog}
        />
        <div ref={catalogRef}>
          <Catalog
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onAddToCart={handleAddToCart}
            onViewDetails={setSelectedProduct}
          />
        </div>
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
