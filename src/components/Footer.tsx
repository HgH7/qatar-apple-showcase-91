import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="section-container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-lg font-bold text-primary-foreground">AS</span>
              </div>
              <span className="font-semibold text-foreground">
                {t('company.name')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('company.slogan')}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span dir="ltr">+974 4400 9000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span>sales@advanced.qa</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">
              {t('nav.products')}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/products?cat=phones" className="transition-colors hover:text-secondary">
                  {t('products.phones')}
                </a>
              </li>
              <li>
                <a href="/products?cat=laptops" className="transition-colors hover:text-secondary">
                  {t('products.laptops')}
                </a>
              </li>
              <li>
                <a href="/products?cat=tablets" className="transition-colors hover:text-secondary">
                  {t('products.tablets')}
                </a>
              </li>
              <li>
                <a href="/products?cat=watches" className="transition-colors hover:text-secondary">
                  {t('products.watches')}
                </a>
              </li>
              <li>
                <a href="/products?cat=headphones" className="transition-colors hover:text-secondary">
                  {t('products.headphones')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © {currentYear} {t('company.name')}. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
