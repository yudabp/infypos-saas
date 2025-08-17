import React, { useEffect, useState } from 'react'
import TabTitle from '../../shared/tab-title/TabTitle';
import * as EmailValidator from 'email-validator';
import { forgotPassword } from '../../store/action/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import { Image } from "react-bootstrap-v5";
import { Link } from 'react-router-dom';
import { ROLES } from '../../constants';
import Cookies from "js-cookie";
import { fetchLanguages } from '../../store/action/languageAction';
import LanguageLayout from './LanguageLayout';
import { fetchFrontCms } from '../../store/action/frontCmsAction';

const ForgotPassword = () => {
    const { loginUser, frontCms } = useSelector(state => state)
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch()
    const [forgotValue, setForgotValue] = useState({ email: '' });
    const [errors, setErrors] = useState({ email: '' });
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("authToken");

    useEffect(() => {
        clearEmail();
        dispatch(fetchFrontCms());
        dispatch(fetchLanguages());
        if (!loginUser.errorMessage) {
            if (loginUser) {
                setLoading(false);
                setForgotValue({ email: '' })
            }
        } else {
            setLoading(false);
        }
        if (token) {
            if (loginUser.roles === ROLES.SUPER_ADMIN) {
                window.location.href = "/app/#/admin/dashboard"
            } else {
                window.location.href = "/app/#/user/dashboard";
            }
        }
    }, [loginUser, forgotPassword]);

    const handleChange = (e) => {
        e.persist();
        setForgotValue(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
        setDisable(false);
        setErrors('');
    };

    const prepareFormData = () => {
        const formData = new FormData();
        formData.append('email', forgotValue.email);
        formData.append(
            "language_code",
            localStorage.getItem("updated_language")
        );
        return formData;
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!EmailValidator.validate(forgotValue['email'])) {
            if (!forgotValue['email']) {
                errorss['email'] = getFormattedMessage('globally.input.email.validate.label');
            } else {
                errorss['email'] = getFormattedMessage('globally.input.email.valid.validate.label');
            }
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const clearEmail = () => {
        if (loginUser && loginUser === 'We have emailed your password reset link!') {
            setForgotValue({ email: '' });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const valid = handleValidation();
        !valid && setLoading(false);
        if (valid) {
            dispatch(forgotPassword(prepareFormData(forgotValue)));
            setDisable(true);
        }
    };

    return (
        <div className="content d-flex flex-column flex-column-fluid position-relative" style={{ backgroundImage: "url(/assets/images/asked-bg.png)" }}>
            <LanguageLayout/>
            <div className='d-flex flex-column flex-column-fluid align-items-center justify-content-center margin-top p-4'>
                <TabTitle title='Forgot Password' />
                <div className="col-12 text-center align-items-center justify-content-center">
                    <a href="/" className="image mb-7 mb-sm-10">
                        <Image className='logo-height image'
                            src={frontCms && frontCms.value && frontCms.value.app_logo}
                            height={60}
                            style={{ objectFit: "contain" }}
                        />
                    </a>
                </div>
                <div className='bg-theme-white rounded-15 shadow-md width-540 px-5 px-sm-7 py-10 mx-auto'>
                    <form className='form w-100'>
                        <div className='text-center mb-7'>
                            <h1 className='text-dark mb-3'>{getFormattedMessage('login-form.forgot-password.label')}</h1>
                        </div>
                        <div className='mb-10'>
                            <div className='d-flex justify-content-between mt-n5'>
                                <div className='d-flex justify-content-between w-100'>
                                    <label
                                        className='form-label'>{getFormattedMessage('globally.input.email.label')}:
                                        <span className='required' /></label>
                                    <Link
                                        to='/login'
                                        className='link-info fs-6 text-decoration-none text-purple'
                                    >
                                        {getFormattedMessage('login-form.go-to-sign-in.label')}
                                    </Link>
                                </div>
                            </div>
                            <input
                                placeholder={placeholderText('globally.input.email.placeholder.label')} required
                                value={forgotValue.email} type='text' name='email' autoComplete='on'
                                className='form-control'
                                onChange={(e) => handleChange(e)}
                            />
                            <span className='text-danger d-block fw-400 fs-small mt-2'>{errors['email'] ? errors['email'] : null}</span>
                        </div>
                        <div className='d-flex justify-content-center pb-lg-0'>
                            <button className='btn btn-purple' type='submit'
                                onClick={(e) => onSubmit(e)} disabled={disable}>
                                {loading ?
                                    <span>
                                        {getFormattedMessage('globally.loading.label')}
                                    </span> :
                                    <span>
                                        {getFormattedMessage('forgot-password-form.reset-link-btn.label')}
                                    </span>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default ForgotPassword;

