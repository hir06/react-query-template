import { useQuery, useMutation } from '@tanstack/react-query';
import { postURL } from "../constants";
import { AppNameNamespace } from '../types/AppNamespace.types';

async function fetchAllProducts() {
  const response = await fetch(`https://dummyjson.com/products`);
  if (response.status !== 500) {
    const data: any = await response.json();
    return data.products;
  } else {
    throw new Error('Server responded with status 500');
  }
}

async function submitAddProduct(data: any) {
  const response = await fetch(`${postURL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to add the product');
  }
  return response.json();
}

// React Query hook for fetching all partners list
export const useGetAllProducts = () => {
  return useQuery<any, Error>({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });
}

// React Query hook for submitting availability for events
export const useSubmitAddProduct = () => {
  return useMutation<any, Error, any>({
    mutationFn: submitAddProduct,
  });
}
