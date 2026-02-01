import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Truck, Building2, ArrowRight } from 'lucide-react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import products from '@/data/products.json';

const Home = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const valueProps = [
    {
      icon: Shield,
      title: t('value.warranty.title'),
      description: t('value.warranty.description'),
    },
    {
      icon: Truck,
      title: t('value.delivery.title'),
      description: t('value.delivery.description'),
    },
    {
      icon: Building2,
      title: t('value.corporate.title'),
      description: t('value.corporate.description'),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted to-background py-20 md:py-32">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
            <Link to="/products" className="btn-hero">
              {t('hero.cta')}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5" />
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              {t('featured.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('featured.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 font-medium text-secondary transition-colors hover:text-secondary/80"
            >
              {t('products.title')}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="border-t border-border bg-card py-16 md:py-24">
        <div className="section-container">
          <div className="grid gap-8 md:grid-cols-3">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                  <prop.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {prop.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
