import { useCallback } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useToast } from './use-toast';

export function useCheckout() {
  const { toast } = useToast();
  const { items, initiateCheckout } = useCartStore();

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Redirecting to checkout...",
      description: "You'll be redirected to secure Shopify checkout",
    });

    const success = await initiateCheckout();
    
    if (!success) {
      toast({
        title: "Checkout failed",
        description: "Unable to process checkout. Please try again.",
        variant: "destructive"
      });
    }
    
    return success;
  }, [items, initiateCheckout, toast]);

  return {
    handleCheckout,
    canCheckout: items.length > 0
  };
}