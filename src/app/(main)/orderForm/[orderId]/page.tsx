"use client";

import CustomForm from "@/components/CustomForm/CustomForm";
import { Field } from "@/components/CustomForm/types";
import { FadeInSection } from "@/components/transitions";
import usePostData from "@/hooks/usePostData";
import { useGenericQuery } from "@/hooks/useQuery";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// API endpoints
const ACTIVE_BRANDS = "/user/brand/getActiveBrands";
const GET_DEAL_BY_ID = "/user/deal/getDealsByIds";
const GET_ACTIVE_PLATFORM = "/user/platForm/getAllPlatForms";
const UPDATE_ORDER = "/user/order/update";
const FILE_UPLOAD = "/fileUpload";

// Define interfaces
interface Deal {
  _id: string;
  productName?: string;
  actualPrice?: number;
  finalCashBackForUser?: number;
  deliveryFee?: number;
  platForm?: {
    _id: string;
    name: string;
  };
  dealCategory?: {
    _id: string;
    name: string;
  };
  parentDealId?: {
    productName?: string;
    actualPrice?: number;
    finalCashBackForUser?: number;
    platForm?: {
      _id: string;
      name: string;
    };
    dealCategory?: {
      _id: string;
      name: string;
    };
    exchangeDealProducts?: any[];
  };
  exchangeDealProducts?: any[];
}

interface Brand {
  _id: string;
  name: string;
}

interface Platform {
  _id: string;
  name: string;
}

interface Category {
  _id: string;
  name: string;
}

interface FormValues {
  profileName: string;
  orderId: string;
  orderDate: Date;
  orderScreenShot: string;
  orderScreenShotUrl?: string;
  platformOptions: any;
  brandName: any;
  categoryName: any;
  productName: any[];
  deliveryFee: string;
  price: string;
  finalCashBackForUser: string;
}
interface OrderData {
  _id: string;
  reviewerName?: string;
  orderIdOfPlatForm?: string;
  deliveredScreenShot?: string;
  reviewScreenShot?: string;
  sellerFeedback?: string;
  reviewLink?: string;
  paymentId?: string;
  orderFormStatus?: string;
  exchangeDealProducts?: any;
  order_date?:string;
  orderScreenShot?:string;
  dealId?: {
    _id?: string;
    parentDealId?:any
    platForm?:any,
    dealCategory?:any;
    brand?:any
    productName?:string;
    actualPrice?:string;
    finalCashBackForUser:string
  };
  deliveryFee?:string
}
interface ApiResponse {
  success: boolean;
  message: string;
  data: OrderData;
}
export default function OrderFormPage({ params }: any) {
  const unwrappedParams = React.use(params) as { orderId: string };
  const { orderId } = unwrappedParams;
  const { data: orderData, isLoading: isOrderLoading } = useGenericQuery<ApiResponse>(
    ['orderDetail', orderId],
    `/user/order/getOrderById/${orderId}`
  );

  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const [state, setState] = useState({
    brandData: [] as Brand[],
    allBrandDeals: [] as Deal[],
    selectedDeal: [orderData?.data?.dealId?.parentDealId || orderData?.data?.dealId] as Deal[],
    selectedPlatform: {} as any,
    allCategories: [] as Category[],
    newDeals: [] as Deal[],
    selectedDealCategory: {} as any,
    selectedExchange: orderData?.data?.exchangeDealProducts?.[0]||'',
  });

  const { brandData, allBrandDeals, selectedDeal, selectedPlatform, allCategories, newDeals, selectedDealCategory, selectedExchange } = state;

  const updateState = (data: any) => setState(state => ({ ...state, ...data }));

  // Fetch platforms
  const { data: platformData, isPending: isPlatformLoading } = useGenericQuery<{ data: Platform[] }>(
    ["platforms"],
    GET_ACTIVE_PLATFORM
  );

  // Fetch brands
  const { mutate: getallBrands } = usePostData(ACTIVE_BRANDS, {
    onSuccess: async ({ data }: any) => {
      updateState({
        brandData: data || [],
      });
    },
    onError: async (error: any) => {
      console.error("Error fetching brands:", error);
    },
  });

  // Fetch deals by brand
  const { mutate: getDealsByBrand } = usePostData(GET_DEAL_BY_ID, {
    onSuccess: async ({ data }: any) => {
      const deals = data || [];
      let filteredDeals = deals.filter((item: Deal) => {
        const platformId = item?.parentDealId?.platForm?._id || item?.platForm?._id;
        return platformId === selectedPlatform?.id;
      });

      if (isEmpty(filteredDeals)) {
        updateState({ allBrandDeals: [] });
        console.error("No products available");
        return;
      }

      const allCategories = filteredDeals.map((item: Deal) => {
        return item?.parentDealId?.dealCategory || item?.dealCategory;
      });

      const uniqueCategories = Array.from(
        new Map(allCategories.map((category: any) => [category?._id, category])).values()
      );

      updateState({
        allBrandDeals: filteredDeals,
        allCategories: uniqueCategories,
      });
    },
    onError: async (error: any) => {
      console.error("Error fetching deals:", error);
    },
  });

  // Create order
  const { mutate: createOrder } = usePostData(UPDATE_ORDER, {
    onSuccess: async ({ data }: any) => {
      console.log("Order created:", data);
      updateState({
        brandData: [],
        allBrandDeals: [],
        selectedDeal: [],
        selectedPlatform: {},
      });

      // Show success message
      alert(data?.message || "Order Updated successfully");

      // Redirect to home
      setTimeout(() => {
        router.back();
      }, 400);
    },
    onError: async (error: any) => {
      console.error("Error creating order:", error);
      alert(error?.response?.data?.message || "Failed to create order");
    },
  });

  // Platform options
  const platformOptions = platformData?.data?.map((platform: Platform) => ({
    label: platform?.name,
    value: platform?.name,
    id: platform?._id,
  })) || [];

  // Brand options
  const brandOptions = brandData?.map((brand: Brand) => ({
    label: brand?.name,
    value: brand?.name,
    id: brand?._id,
  })) || [];

  // Deal options
  const dealOptions = !isEmpty(newDeals)
    ? newDeals.map((deal: Deal) => {
      const productName = deal?.parentDealId?.productName || deal?.productName || '';
      const actualPrice = deal?.parentDealId?.actualPrice || deal?.actualPrice || 0;
      const platformName = deal?.parentDealId?.platForm?.name || deal?.platForm?.name || '';
      const id = deal?._id || '';
      const finalCashBackForUser = deal?.finalCashBackForUser || 0;
      const exchangeDealProducts = deal?.parentDealId?.exchangeDealProducts || deal?.exchangeDealProducts || [];

      return {
        label: `${productName} (₹${actualPrice}) (${platformName})`,
        value: `${productName} (${platformName})`,
        id,
        price: actualPrice,
        finalCashBackForUser,
        exchangeDealProducts,
      };
    }) || []
    : allBrandDeals.map((deal: Deal) => {
      const productName = deal?.parentDealId?.productName || deal?.productName || '';
      const actualPrice = deal?.parentDealId?.actualPrice || deal?.actualPrice || 0;
      const platformName = deal?.parentDealId?.platForm?.name || deal?.platForm?.name || '';
      const id = deal?._id || '';
      const finalCashBackForUser = deal?.finalCashBackForUser || 0;
      const exchangeDealProducts = deal?.parentDealId?.exchangeDealProducts || deal?.exchangeDealProducts || [];

      return {
        label: `${productName} (₹${actualPrice}) (${platformName})`,
        value: `${productName} (${platformName})`,
        id,
        price: actualPrice,
        finalCashBackForUser,
        exchangeDealProducts,
      };
    }) || [];

  // Category options
  const categoryOptions = allCategories?.map((cat: Category) => ({
    label: cat?.name,
    value: cat?.name,
    id: cat?._id
  })) || [];

  // Validation schema
  const validationSchema = Yup.object().shape({
    profileName: Yup.string().required('Name is required'),
    orderId: Yup.string().required('Order ID is required'),
    orderDate: Yup.date().required('Order Date is required'),
    orderScreenShot: Yup.string().required('Order Screenshot is required'),
    price: Yup.number().required('Price is required'),
    finalCashBackForUser: Yup.number().required('Refund is required'),
    deliveryFee: Yup.number().optional()
  });


  // Handle form submission
  const handleSubmit = (values: { [key: string]: any }) => {

    createOrder({
      dealIds: values?.productName.map((item: any) => {
        return item?.id;
      }),
      reviewerName: values?.profileName,
      orderIdOfPlatForm: values?.orderId,
      orderScreenShot: values?.orderScreenShot,
      exchangeDealProducts: !!selectedExchange ? [selectedExchange] : [],
      orderDate: dayjs(values?.orderDate).format('YYYY-MM-DD'),
      deliveryFee: values?.deliveryFee.toString(),
      orderId: orderData?.data?._id
    });
  };

  // Check if platform is selected
  const checkPlatformSelected = (isopen: boolean, value: string) => {
    if (
      !isopen &&
      (value === 'brandName' || value === 'productName' || value === 'categoryName') &&
      isEmpty(selectedPlatform)
    ) {
      alert('Please select a platform first');
      return false;
    }

    if (!isopen && value === 'productName' && isEmpty(selectedDealCategory)) {
      alert('Please select deal category first');
      return false;
    }

    return true;
  };

  // Handle field changes
  const handleFieldChange = (
    field: string,
    value: any,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, error: string) => void
  ) => {
    if (field === 'platformOptions') {
      if (selectedPlatform?.id === value?.id) {
        updateState({ selectedPlatform: {} });
        setFieldValue('platformOptions', '');
        setFieldValue('productName', []);
        setFieldValue('brandName', '');
        setFieldValue('categoryName', '');
        updateState({ newDeals: [], brandOptions: [], allCategories: [], allBrandDeals: [], selectedDealCategory: {} });
        return true;
      } else {
        updateState({ selectedPlatform: value });
        getallBrands({ search: '', offset: 0, limit: 2000 });
        setFieldValue('productName', []);
        setFieldValue('brandName', '');
        setFieldValue('categoryName', '');
        updateState({ newDeals: [], brandOptions: [], allCategories: [], allBrandDeals: [], selectedDealCategory: {} });
      }
    }

    if (field === 'brandName') {
      setFieldValue('productName', []);
      setFieldValue('categoryName', '');
      updateState({ newDeals: [], allCategories: [], selectedDealCategory: {} });
      getDealsByBrand({
        type: 'brand',
        id: value?.id,
        offset: 0,
        limit: 200,
      });
    }

    if (field === 'categoryName') {
      let newDeals = allBrandDeals.filter((item: any) => item?.dealCategory?._id === value?.id);
      setFieldValue('productName', []);
      updateState({ newDeals: newDeals, selectedDeal: [], selectedDealCategory: value });
    }

    if (field === 'productName') {
      if (value.length > 0 && value[value.length - 1]?.exchangeDealProducts?.length > 0 && selectedDeal.length > 0) {
        alert('You cannot select exchange deal with other deals.');
        return true;
      }
      updateState({ selectedDeal: value });
    }
  };


  // Define form fields for CustomForm
  const formFields: Field[] = [
    {
      name: 'profileName',
      label: 'Profile name/ Reviewer name',
      type: 'text',
      placeholder: 'Enter your name',
      initialValue:orderData?.data?.reviewerName,
      disabled: false,
    },
    {
      name: 'orderId',
      label: 'Order ID',
      type: 'text',
      placeholder: 'Enter order ID',
      initialValue:orderData?.data?.orderIdOfPlatForm,
      disabled: false,
    },
    {
      name: 'orderDate',
      label: 'Order Date',
      type: 'date',
      maxDate: new Date(),
      initialValue:dayjs(orderData?.data?.order_date),
      disabled: false,
    },
    {
      name: 'orderScreenShot',
      label: 'Order Screenshot',
      type: 'image',
      subHeading: 'If you are taking more than one deal please make a collage of order screenshot. Image must be below 4 mb and in jpg/png format',
      initialValue:orderData?.data?.orderScreenShot,
      disabled: false,
    },
    {
      name: 'platformOptions',
      label: 'Platform',
      type: 'select',
      options: platformOptions,
      disabled: isPlatformLoading,
      initialValue:{
        label: orderData?.data?.dealId?.parentDealId?.platForm?.name || orderData?.data?.dealId?.platForm?.name,
        value: orderData?.data?.dealId?.parentDealId?.platForm?.name || orderData?.data?.dealId?.platForm?.name,
        id: orderData?.data?.dealId?.parentDealId?.platForm?._id || orderData?.data?.dealId?.platForm?._id,
      },
    },
    {
      name: 'brandName',
      label: 'Brand',
      type: 'select',
      options: brandOptions,
      disabled: isEmpty(selectedPlatform),
      initialValue: {
        label: orderData?.data?.dealId?.parentDealId?.brand?.name || orderData?.data?.dealId?.brand?.name,
        value: orderData?.data?.dealId?.parentDealId?.brand?.name || orderData?.data?.dealId?.brand?.name,
        id: orderData?.data?.dealId?.parentDealId?.brand?._id || orderData?.data?.dealId?.brand?._id,
      },
    },
    {
      name: 'categoryName',
      label: 'Deal Category',
      type: 'select',
      options: categoryOptions,
      disabled: isEmpty(selectedPlatform),
      initialValue: {
        label: orderData?.data?.dealId?.parentDealId?.dealCategory?.name || orderData?.data?.dealId?.dealCategory?.name,
        value: orderData?.data?.dealId?.parentDealId?.dealCategory?.name || orderData?.data?.dealId?.dealCategory?.name,
        id: orderData?.data?.dealId?.parentDealId?.dealCategory?._id || orderData?.data?.dealId?.dealCategory?._id,
      },
    },
    {
      name: 'productName',
      label: 'Product',
      type: 'multiselect',
      options: dealOptions,
      disabled: isEmpty(selectedDealCategory),
      subHeading: 'Hold Ctrl/Cmd to select multiple products',
      initialValue: [{
        label: orderData?.data?.dealId?.parentDealId?.productName || orderData?.data?.dealId?.productName,
        value: orderData?.data?.dealId?.parentDealId?.productName || orderData?.data?.dealId?.productName,
        id: orderData?.data?.dealId?._id,
        price: orderData?.data?.dealId?.parentDealId?.actualPrice || orderData?.data?.dealId?.actualPrice,
        finalCashBackForUser: orderData?.data?.dealId?.finalCashBackForUser,
      }],
    },
    {
      name: 'deliveryFee',
      label: 'Delivery Fee (in ₹)',
      type: 'numeric',
      placeholder: 'Enter delivery fee',
      disabled: false,
      initialValue:orderData?.data?.deliveryFee
    },
    {
      name: 'price',
      label: 'Price (in ₹)',
      type: 'text',
      disabled: true,
      initialValue: orderData?.data?.dealId?.actualPrice,
    },
    {
      name: 'finalCashBackForUser',
      label: 'Refund Amount (in ₹)',
      type: 'text',
      initialValue: orderData?.data?.dealId?.finalCashBackForUser,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <FadeInSection delay={0.1}>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Order Form</h1>
            <p className="text-gray-600 mb-6">
              Fill out the form below to submit your order details.
            </p>

            <CustomForm
              fields={formFields}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              resetKey={resetKey}
              onReset={() => {
                updateState({ selectedPlatform: {}, selectedDeal: [] });
                setResetKey(prevKey => prevKey + 1);
              }}
              onInputValueChange={handleFieldChange}
              onDropdownOpen={checkPlatformSelected}
              submitButtonText="Submit Order"
              className="space-y-6"
            />
          </div>
        </FadeInSection>
      </div>
    </div>
  );
} 