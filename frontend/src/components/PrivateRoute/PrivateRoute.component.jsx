import { Navigate } from 'react-router-dom';

import { useWallet } from '../../providers/Wallet';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { signer } = useWallet();

  if (!signer) {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
