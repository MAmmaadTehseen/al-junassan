import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { formatPrice } from "@/lib/utils";
import { Truck, Shield } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} from Al Junassan`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  );

  return (
    <section className="pt-28 pb-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <ProductImageGallery images={product.images} name={product.name} />

          <div className="space-y-6">
            {product.category && (
              <Badge variant="gold">{product.category.name}</Badge>
            )}
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-luxury-black">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-gold-600">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price &&
                product.compare_at_price > product.price && (
                  <span className="text-lg text-luxury-gray line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
            </div>

            {product.description && (
              <p className="text-luxury-gray leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="space-y-2 text-sm text-luxury-gray">
              {product.material && (
                <p>
                  <span className="font-medium text-luxury-black">
                    Material:
                  </span>{" "}
                  {product.material}
                </p>
              )}
              {product.weight && (
                <p>
                  <span className="font-medium text-luxury-black">
                    Weight:
                  </span>{" "}
                  {product.weight}
                </p>
              )}
              <p>
                <span className="font-medium text-luxury-black">Gender:</span>{" "}
                {product.gender === "unisex"
                  ? "Unisex"
                  : product.gender === "men"
                    ? "Men"
                    : "Women"}
              </p>
            </div>

            <AddToCartButton product={product} />

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Truck className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>Cash on Delivery available all over Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-gray">
                <Shield className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <span>Premium quality guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <SectionHeading title="You May Also Like" />
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </Container>
    </section>
  );
}
