import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
} from './types';

// Default subscription status
const defaultStatus: SubscriptionStatus = {
  isSubscribed: false,
  isInTrial: false,
  willRenew: false,
};

// Create context with undefined default
const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

/**
 * Props for SubscriptionProvider
 */
export interface SubscriptionProviderProps {
  children: ReactNode;
  /** RevenueCat API key (optional - for RevenueCat integration) */
  revenueCatApiKey?: string;
  /** Initial products if not using RevenueCat */
  initialProducts?: SubscriptionProduct[];
  /** Initial status if not using RevenueCat */
  initialStatus?: SubscriptionStatus;
  /** Custom purchase handler */
  onPurchase?: (productId: string) => Promise<boolean>;
  /** Custom restore handler */
  onRestore?: () => Promise<boolean>;
  /** Called when subscription status changes */
  onStatusChange?: (status: SubscriptionStatus) => void;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Provider component for subscription state management
 * Supports RevenueCat integration or custom purchase handlers
 */
export function SubscriptionProvider({
  children,
  revenueCatApiKey,
  initialProducts = [],
  initialStatus = defaultStatus,
  onPurchase,
  onRestore,
  onStatusChange,
  debug = false,
}: SubscriptionProviderProps) {
  const [products, setProducts] = useState<SubscriptionProduct[]>(initialProducts);
  const [status, setStatus] = useState<SubscriptionStatus>(initialStatus);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logger
  const log = useCallback(
    (...args: unknown[]) => {
      if (debug) {
        console.log('[SubscriptionProvider]', ...args);
      }
    },
    [debug]
  );

  // Initialize RevenueCat if API key provided
  useEffect(() => {
    if (revenueCatApiKey) {
      initializeRevenueCat();
    }
  }, [revenueCatApiKey]);

  // Notify status changes
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  /**
   * Initialize RevenueCat SDK
   * Placeholder - actual implementation requires react-native-purchases
   */
  const initializeRevenueCat = async () => {
    log('Initializing RevenueCat...');
    setIsLoading(true);
    setError(null);

    try {
      // Placeholder for RevenueCat initialization
      // In actual implementation:
      // import Purchases from 'react-native-purchases';
      // await Purchases.configure({ apiKey: revenueCatApiKey });
      // const offerings = await Purchases.getOfferings();
      // const customerInfo = await Purchases.getCustomerInfo();
      
      log('RevenueCat initialization placeholder - implement with react-native-purchases');
      
      // For now, use initial products
      if (initialProducts.length > 0) {
        setProducts(initialProducts);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize';
      setError(message);
      log('RevenueCat initialization error:', message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Select a product
   */
  const selectProduct = useCallback(
    (productId: string) => {
      log('Selecting product:', productId);
      setSelectedProductId(productId);
      setError(null);
    },
    [log]
  );

  /**
   * Set billing period
   */
  const setPeriod = useCallback(
    (period: 'monthly' | 'yearly') => {
      log('Setting period:', period);
      setSelectedPeriod(period);
      // Auto-select first product of the new period
      const periodProduct = products.find((p) => p.period === period);
      if (periodProduct) {
        setSelectedProductId(periodProduct.id);
      }
    },
    [log, products]
  );

  /**
   * Purchase selected product
   */
  const purchase = useCallback(async (): Promise<boolean> => {
    if (!selectedProductId) {
      setError('No product selected');
      return false;
    }

    log('Initiating purchase for:', selectedProductId);
    setIsPurchasing(true);
    setError(null);

    try {
      // Use custom handler if provided
      if (onPurchase) {
        const success = await onPurchase(selectedProductId);
        if (success) {
          setStatus((prev) => ({
            ...prev,
            isSubscribed: true,
            currentTierId: selectedProductId,
          }));
        }
        return success;
      }

      // RevenueCat purchase placeholder
      // In actual implementation:
      // import Purchases from 'react-native-purchases';
      // const product = products.find(p => p.id === selectedProductId);
      // if (product?.rcPackageId) {
      //   const { customerInfo } = await Purchases.purchasePackage(package);
      //   // Update status based on customerInfo
      // }

      log('Purchase placeholder - implement with react-native-purchases or custom handler');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Purchase failed';
      setError(message);
      log('Purchase error:', message);
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedProductId, onPurchase, log, products]);

  /**
   * Restore previous purchases
   */
  const restore = useCallback(async (): Promise<boolean> => {
    log('Restoring purchases...');
    setIsLoading(true);
    setError(null);

    try {
      // Use custom handler if provided
      if (onRestore) {
        const success = await onRestore();
        return success;
      }

      // RevenueCat restore placeholder
      // In actual implementation:
      // import Purchases from 'react-native-purchases';
      // const customerInfo = await Purchases.restorePurchases();
      // // Update status based on customerInfo

      log('Restore placeholder - implement with react-native-purchases or custom handler');
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Restore failed';
      setError(message);
      log('Restore error:', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [onRestore, log]);

  /**
   * Refresh products and status
   */
  const refresh = useCallback(async (): Promise<void> => {
    log('Refreshing subscription data...');
    setIsLoading(true);
    setError(null);

    try {
      if (revenueCatApiKey) {
        // RevenueCat refresh placeholder
        // In actual implementation:
        // import Purchases from 'react-native-purchases';
        // const offerings = await Purchases.getOfferings();
        // const customerInfo = await Purchases.getCustomerInfo();
        // // Update products and status
        log('Refresh placeholder - implement with react-native-purchases');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Refresh failed';
      setError(message);
      log('Refresh error:', message);
    } finally {
      setIsLoading(false);
    }
  }, [revenueCatApiKey, log]);

  // Memoize context value
  const value = useMemo<SubscriptionContextValue>(
    () => ({
      products,
      status,
      selectedProductId,
      selectedPeriod,
      isLoading,
      isPurchasing,
      error,
      selectProduct,
      setPeriod,
      purchase,
      restore,
      refresh,
    }),
    [
      products,
      status,
      selectedProductId,
      selectedPeriod,
      isLoading,
      isPurchasing,
      error,
      selectProduct,
      setPeriod,
      purchase,
      restore,
      refresh,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

/**
 * Hook to access subscription context
 * @throws Error if used outside SubscriptionProvider
 */
export function useSubscription(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

/**
 * Hook to check if user has active subscription
 */
export function useIsSubscribed(): boolean {
  const { status } = useSubscription();
  return status.isSubscribed;
}

/**
 * Hook to get filtered products by period
 */
export function useProductsByPeriod(
  period: 'monthly' | 'yearly'
): SubscriptionProduct[] {
  const { products } = useSubscription();
  return useMemo(
    () => products.filter((p) => p.period === period),
    [products, period]
  );
}

export { SubscriptionContext };
