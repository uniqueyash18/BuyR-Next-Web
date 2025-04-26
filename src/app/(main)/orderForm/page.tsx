"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FadeInSection } from "@/components/transitions";
import usePostData from "@/hooks/usePostData";
import { useGenericQuery } from "@/hooks/useQuery";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { isEmpty } from "lodash";
import * as Yup from "yup";
import Image from "next/image";
import CustomForm from "@/components/CustomForm/CustomForm";
import { Field } from "@/components/CustomForm/types";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// API endpoints
const ACTIVE_BRANDS = "/user/brand/getActiveBrands";
const GET_DEAL_BY_ID = "/user/deal/getDealsByIds";
const GET_ACTIVE_PLATFORM = "/user/platForm/getAllPlatForms";
const CREATE_ORDER = "/user/order/create";
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

export default function OrderFormPage() {
  const router = useRouter();
  const [resetKey, setResetKey] = useState(0);
  const [state, setState] = useState({
    brandData: [] as Brand[],
    allBrandDeals: [] as Deal[],
    selectedDeal: [] as Deal[],
    selectedPlatform: {} as any,
    allCategories: [] as Category[],
    newDeals: [] as Deal[],
    selectedDealCategory: {} as any,
    selectedExchange: "",
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
  const { mutate: createOrder } = usePostData(CREATE_ORDER, {
    onSuccess: async ({ data }: any) => {
      console.log("Order created:", data);
      updateState({
        brandData: [],
        allBrandDeals: [],
        selectedDeal: [],
        selectedPlatform: {},
      });

      // Show success message
      alert(data?.message || "Order created successfully");

      // Redirect to home
      setTimeout(() => {
        router.push("/");
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

  // Initial form values
  const initialValues: FormValues = {
    profileName: "",
    orderId: "",
    orderDate: new Date(),
    orderScreenShot: "",
    platformOptions: "",
    brandName: "",
    categoryName: "",
    productName: [],
    deliveryFee: "",
    price: "",
    finalCashBackForUser: "",
  };

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
      deliveryFee: values?.deliveryFee.toString()
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

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      alert('Please select an image first');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Image must be below 4MB');
      return;
    }

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert('Image must be in jpg/png format');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue('orderScreenShot', reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(FILE_UPLOAD, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Image uploaded successfully:', data);
        // Store the uploaded image URL
        setFieldValue('orderScreenShotUrl', data.url || data.data?.url);
      } else {
        console.error('Upload failed:', data.message);
        alert(data.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error?.message || 'An error occurred during upload');
    }
  };

  // Define form fields for CustomForm
  const formFields: Field[] = [
    {
      name: 'profileName',
      label: 'Profile name/ Reviewer name',
      type: 'text',
      placeholder: 'Enter your name',
      disabled: false,
    },
    {
      name: 'orderId',
      label: 'Order ID',
      type: 'text',
      placeholder: 'Enter order ID',
      disabled: false,
    },
    {
      name: 'orderDate',
      label: 'Order Date',
      type: 'date',
      maxDate: new Date(),
      disabled: false,
    },
    {
      name: 'orderScreenShot',
      label: 'Order Screenshot',
      type: 'image',
      subHeading: 'If you are taking more than one deal please make a collage of order screenshot. Image must be below 4 mb and in jpg/png format',
      disabled: false,
    },
    {
      name: 'platformOptions',
      label: 'Platform',
      type: 'select',
      options: platformOptions,
      disabled: isPlatformLoading,
    },
    {
      name: 'brandName',
      label: 'Brand',
      type: 'select',
      options: brandOptions,
      disabled: isEmpty(selectedPlatform),
    },
    {
      name: 'categoryName',
      label: 'Deal Category',
      type: 'select',
      options: categoryOptions,
      disabled: isEmpty(selectedPlatform),
    },
    {
      name: 'productName',
      label: 'Product',
      type: 'multiselect',
      options: dealOptions,
      disabled: isEmpty(selectedDealCategory),
      subHeading: 'Hold Ctrl/Cmd to select multiple products',
    },
    {
      name: 'deliveryFee',
      label: 'Delivery Fee (in ₹)',
      type: 'numeric',
      placeholder: 'Enter delivery fee',
      disabled: false,
    },
    {
      name: 'price',
      label: 'Price (in ₹)',
      type: 'text',
      disabled: true,
      initialValue: '',
    },
    {
      name: 'finalCashBackForUser',
      label: 'Refund Amount (in ₹)',
      type: 'text',
      initialValue:  '',
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