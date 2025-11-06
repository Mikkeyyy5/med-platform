import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  const goBack = () => {
    navigate(-1);
  };

  const replace = (path) => {
    navigate(path, { replace: true });
  };

  return {
    goTo,
    goBack,
    replace
  };
};