import { clearSessionData, setSessionData } from "@redux/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserSession } from "@utils/types";
import { RootState } from "@redux/store";

const useSession = () => {
  const dispatch = useDispatch();
  const sessionInstance: UserSession = useSelector((state: RootState) => state.session);

  const clearSession = () => {
    dispatch(clearSessionData());
  };

  const setSession = (data: Partial<UserSession>) => {
    dispatch(setSessionData(data));
  }

  return {
    sessionData: sessionInstance,
    clearSessionData: clearSession,
    setSessionData: setSession,
  };
};

export default useSession;
