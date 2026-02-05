import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  children?: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'ar';
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const generateWhatsAppMessage = () => {
    if (items.length === 0) return '';

    const intro = lang === 'ar' ? 'مرحبًا،\nأود طلب المنتجات التالية:\n\n' : 'Hello,\nI would like to order the following products:\n\n';
    
    const itemsList = items.map((item, index) => {
      const num = `${index + 1}️⃣`;
      const name = item.name[lang];
      const props: string[] = [];
      
      if (item.properties.color) {
        const colorLabel = lang === 'ar' ? 'اللون' : 'Color';
        props.push(`${colorLabel}: ${item.properties.color}`);
      }
      if (item.properties.storage) {
        const storageLabel = lang === 'ar' ? 'السعة' : 'Storage';
        props.push(`${storageLabel}: ${item.properties.storage}`);
      }
      if (item.properties.size) {
        const sizeLabel = lang === 'ar' ? 'المقاس' : 'Size';
        props.push(`${sizeLabel}: ${item.properties.size}`);
      }
      
      const quantityLabel = lang === 'ar' ? 'الكمية' : 'Quantity';
      props.push(`${quantityLabel}: ${item.quantity}`);

      return `${num} ${name}\n${props.join('\n')}`;
    }).join('\n\n');

    const outro = lang === 'ar' ? '\n\nشكرًا.' : '\n\nThank you.';

    return intro + itemsList + outro;
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/97400000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t('cart.title')}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {totalItems}
              </span>
            )}
          </button>
        )}
      </SheetTrigger>
      <SheetContent side={lang === 'ar' ? 'left' : 'right'} className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('cart.title')} ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <ShoppingCart className="h-16 w-16 opacity-30" />
            <p>{t('cart.empty')}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name[lang]}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <h4 className="font-medium text-foreground">{item.name[lang]}</h4>
                      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                        {item.properties.color && (
                          <p>{lang === 'ar' ? 'اللون' : 'Color'}: {item.properties.color}</p>
                        )}
                        {item.properties.storage && (
                          <p>{lang === 'ar' ? 'السعة' : 'Storage'}: {item.properties.storage}</p>
                        )}
                        {item.properties.size && (
                          <p>{lang === 'ar' ? 'المقاس' : 'Size'}: {item.properties.size}</p>
                        )}
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.properties, item.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.properties, item.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {(item.price * item.quantity).toLocaleString()} {t('currency')}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId, item.properties)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{t('cart.total')}</span>
                <span className="text-xl font-bold text-foreground">
                  {totalPrice.toLocaleString()} {t('currency')}
                </span>
              </div>
              <Button
                onClick={handleWhatsAppOrder}
                className="w-full gap-2 bg-[#25D366] hover:bg-[#20BD5A]"
                size="lg"
              >
                <MessageCircle className="h-5 w-5" />
                {t('cart.orderViaWhatsApp')}
              </Button>
              <Button
                onClick={clearCart}
                variant="outline"
                className="mt-2 w-full"
              >
                {t('cart.clear')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
