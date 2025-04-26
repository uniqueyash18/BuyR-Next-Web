import { clearUser } from '../slices/userSlice';
import { AppDispatch } from '../store';

export const onLogOut = () => (dispatch: AppDispatch) => {
  dispatch(clearUser());
}; 