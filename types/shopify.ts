export interface ShopifyImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  quantityAvailable?: number;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  productType?: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  options: ProductOption[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  } | null;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage | null;
  products?: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: {
          node: ShopifyImage;
        }[];
      };
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: CartItem;
    }[];
  };
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    } | null;
  };
  totalQuantity: number;
}
