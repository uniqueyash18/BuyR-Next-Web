import api, { getData } from "./apiService";

export interface HomeData {
  Poster: Array<{
    _id: string;
    image: string;
    posterType: string;
    redirectUrl: string;
    brand?: {
      _id: string;
      name: string;
    };
    deal?: {
      _id: string;
      name: string;
    };
    dealCategory?: {
      _id: string;
      name: string;
    };
  }>;
  dealCategoryData: Array<{
    _id: string;
    name: string;
    image: string;
  }>;
  activelyDeals: Array<{
    _id: string;
    productName: string;
    actualPrice: number;
    finalCashBackForUser: number;
    imageUrl?: string;
    brand?: {
      name: string;
      image: string;
    };
    dealCategory?: {
      name: string;
      image: string;
    };
    platForm?: {
      name: string;
      image: string;
    };
    parentDealId?: {
      imageUrl?: string;
      brand?: {
        image: string;
      };
      dealCategory?: {
        name: string;
      };
      platForm?: {
        name: string;
      };
      productName?: string;
      actualPrice?: number;
    };
  }>;
  brandData: Array<{
    _id: string;
    name: string;
    image: string;
  }>;
}

export const getHomeData = async (): Promise<HomeData> => {
  try {
    const response = await getData("/user/getHomeData");
    return response.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

export const getDealDetail = async (id: string) => {
  try {
    const response = await getData(`/user/getDealDetail/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching deal detail:", error);
    throw error;
  }
}; 