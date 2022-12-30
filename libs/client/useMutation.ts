import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data: undefined | T;
  error: undefined | any;
}

type UseMutaionReturn<T> = [(formData: any) => void, UseMutationState<T>];

interface MutateOptions {
  headers?: {
    [key: string]: string
  }[]
}

const useMutation = <T = any>(url: string, options: MutateOptions = {}): UseMutaionReturn<T> => {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  async function mutator(formData: any) {
    setState((prev) => ({ ...prev, loading: true }));
    const headers = options.headers || {}
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      setState((prev) => ({ ...prev, data: json, loading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, error, loading: false }));
    }
  }

  return [mutator, state];
};

export default useMutation;
