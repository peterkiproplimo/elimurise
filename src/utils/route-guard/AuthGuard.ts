import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: any) => {
    
    const { authData } = useAuth();
    const navigate = useNavigate();
    console.log(authData)
    useEffect(() => {
        
       
        if (!authData) {
          
           navigate('login', { replace: true });
        }
    }, [authData, navigate]);

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
