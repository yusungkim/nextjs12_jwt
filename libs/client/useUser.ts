import { useEffect, useState } from "react";
import { UserData } from "../../database";
import { UserDataResponse } from "../../pages/api/auth/login";
import useSWR, { KeyedMutator } from "swr";

interface UseUserState {
  loading: boolean;
  user: undefined | UserData;
}

type UseUserStateReturn = [() => void, UseUserState];

const useUser = (): UseUserStateReturn => {
  const [state, setState] = useState<UseUserState>({
    loading: true,
    user: undefined
  });

  const { mutate: verifyMe, data, error } = useSWR<UserDataResponse>('/api/auth/me');

  useEffect(() =>{
    if (data?.ok || data?.ok == false) {
      setState({ user: data?.user, loading: false })
    }
  }, [data])

  useEffect(() =>{
    if (error) {
      setState({ user: undefined, loading: false })
    }
  }, [error])

  return [verifyMe, state]
};

export default useUser;
