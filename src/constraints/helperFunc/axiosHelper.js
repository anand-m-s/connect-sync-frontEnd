import { useHistory } from 'react-router-dom';

export const navigateToLogin = () => {
  const history = useHistory();
  history.push('/login');
};
