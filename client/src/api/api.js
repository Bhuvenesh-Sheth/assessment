import axios from 'axios';

export const uri = "https://server-roxiler.vercel.app";

export const endpoint =  {
  get_transactions : "/get_transactions",
  get_statistics : "/get_statistics/",
  get_barchart : "/get_barchart/",
  get_piechart : "/get_piechart/",
  get_combined_data : "/get_combined_data/"
}

const axiosInstance = axios.create({
  baseURL: uri,

});

export const getTransactions = async (search = '', page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(endpoint.get_transactions, {
      params: {
        search,
        page,
        perPage
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const getStatistics = async (month) => {
  try {
    const response = await axiosInstance.get(`${endpoint.get_statistics}${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching statistics for month ${month}:`, error);
    throw error;
  }
};

export const getBarchart = async (month) => {
  try {
    const response = await axiosInstance.get(`${endpoint.get_barchart}${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching barchart data for month ${month}:`, error);
    throw error;
  }
};

export const getPiechart = async (month) => {
  try {
    const response = await axiosInstance.get(`${endpoint.get_piechart}${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching piechart data for month ${month}:`, error);
    throw error;
  }
};

export const getCombinedData = async (month) => {
  try {
    const response = await axiosInstance.get(`${endpoint.get_combined_data}${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching combined data for month ${month}:`, error);
    throw error;
  }
};
