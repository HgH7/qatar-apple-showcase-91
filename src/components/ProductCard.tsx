import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Product {
  id: number;
  slug: string;
  name: { en: string; ar: string };
  category: string;
  price: number;
  isNew: boolean;
  isFeatured: boolean;
  images: string[];
  description: { en: string; ar: string };
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="product-card group block"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name[lang]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute start-3 top-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="badge-new">
                {t('products.new')}
              </span>
            )}
            {product.isFeatured && (
              <span className="badge-featured">
                {t('products.featured')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-secondary">
            {t(`products.${product.category}`)}
          </p>
          <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-secondary">
            {product.name[lang]}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {product.description[lang]}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">
              {product.price.toLocaleString()} {t('currency')}
            </span>
            <span className="text-sm font-medium text-secondary opacity-0 transition-opacity group-hover:opacity-100">
              {t('products.viewDetails')} →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
