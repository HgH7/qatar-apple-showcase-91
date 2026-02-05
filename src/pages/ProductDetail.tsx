import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MessageCircle, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { getProductOptions } from '@/data/productOptions';
import { useToast } from '@/hooks/use-toast';
import products from '@/data/products.json';

const ProductDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const lang = i18n.language as 'en' | 'ar';
  const isRTL = lang === 'ar';
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = products.find((p) => p.slug === id);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!product) {
    return (
      <Layout>
        <div className="section-container flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              Product not found
            </h1>
            <Link to="/products" className="text-secondary hover:underline">
              ← Back to products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const options = getProductOptions(product.category);
  const hasOptions = options.colors || options.storage || options.sizes;

  const isOptionsComplete = () => {
    if (!hasOptions) return true;
    if (options.colors && !selectedColor) return false;
    if (options.storage && !selectedStorage) return false;
    if (options.sizes && !selectedSize) return false;
    return true;
  };

  const getSelectedProperties = () => {
    const props: { color?: string; storage?: string; size?: string } = {};
    if (selectedColor) {
      const colorOption = options.colors?.find(c => c.value === selectedColor);
      props.color = colorOption?.label[lang] || selectedColor;
    }
    if (selectedStorage) {
      const storageOption = options.storage?.find(s => s.value === selectedStorage);
      props.storage = storageOption?.label[lang] || selectedStorage;
    }
    if (selectedSize) {
      const sizeOption = options.sizes?.find(s => s.value === selectedSize);
      props.size = sizeOption?.label[lang] || selectedSize;
    }
    return props;
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isOptionsComplete()) return;
    
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      properties: getSelectedProperties(),
      image: product.images[0],
    });

    toast({
      title: t('cart.itemAdded'),
      description: product.name[lang],
    });
  };

  const handleWhatsAppOrder = () => {
    if (!isOptionsComplete()) return;
    
    const props = getSelectedProperties();
    const propsText = Object.entries(props)
      .map(([key, value]) => `${t(`product.${key}`)}: ${value}`)
      .join('\n');
    
    const message = lang === 'ar'
      ? `مرحبًا،\nأود طلب المنتج التالي:\n\n${product.name[lang]}\n${propsText}\n\nشكرًا.`
      : `Hello,\nI would like to order:\n\n${product.name[lang]}\n${propsText}\n\nThank you.`;
    
    const whatsappUrl = `https://wa.me/97400000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/50">
        <div className="section-container py-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t('products.title')}
          </Link>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="section-container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Image */}
              <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-muted">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]}
                  alt={product.name[lang]}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                        activeImage === index
                          ? 'border-secondary'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name[lang]} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Badges */}
              <div className="mb-4 flex gap-2">
                {product.isNew && (
                  <span className="badge-new">{t('products.new')}</span>
                )}
                {product.isFeatured && (
                  <span className="badge-featured">{t('products.featured')}</span>
                )}
              </div>

              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-secondary">
                {t(`products.${product.category}`)}
              </p>

              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                {product.name[lang]}
              </h1>

              <p className="mb-6 text-lg text-muted-foreground">
                {product.description[lang]}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-sm text-muted-foreground">{t('product.price')}</span>
                <p className="text-3xl font-bold text-foreground">
                  {product.price.toLocaleString()} <span className="text-lg">{t('currency')}</span>
                </p>
              </div>

              {/* Product Options */}
              {hasOptions && (
                <div className="mb-6 space-y-4">
                  <h3 className="font-semibold text-foreground">{t('product.selectOptions')}</h3>
                  
                  {/* Color Selection */}
                  {options.colors && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        {t('product.color')} {!selectedColor && <span className="text-destructive">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {options.colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                              selectedColor === color.value
                                ? 'border-secondary bg-secondary/10 text-secondary'
                                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                          >
                            {color.label[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Storage Selection */}
                  {options.storage && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        {t('product.storage')} {!selectedStorage && <span className="text-destructive">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {options.storage.map((storage) => (
                          <button
                            key={storage.value}
                            onClick={() => setSelectedStorage(storage.value)}
                            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                              selectedStorage === storage.value
                                ? 'border-secondary bg-secondary/10 text-secondary'
                                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                          >
                            {storage.label[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {options.sizes && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-muted-foreground">
                        {t('product.size')} {!selectedSize && <span className="text-destructive">*</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {options.sizes.map((size) => (
                          <button
                            key={size.value}
                            onClick={() => setSelectedSize(size.value)}
                            className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                              selectedSize === size.value
                                ? 'border-secondary bg-secondary/10 text-secondary'
                                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                          >
                            {size.label[lang]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="mb-4 font-semibold text-foreground">
                  {t('product.features')}
                </h3>
                <ul className="space-y-3">
                  {product.features[lang].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-muted-foreground"
                    >
                      <Check className="h-5 w-5 flex-shrink-0 text-secondary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleWhatsAppOrder}
                  disabled={!isOptionsComplete()}
                  className="w-full gap-2 bg-[#25D366] hover:bg-[#20BD5A] disabled:opacity-50"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  {t('product.orderNow')}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  disabled={!isOptionsComplete()}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t('product.addToCart')}
                </Button>
                {!isOptionsComplete() && (
                  <p className="text-center text-sm text-muted-foreground">
                    {t('product.selectOptions')}
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="mb-8 text-2xl font-bold text-foreground">
                {t('product.related')}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
