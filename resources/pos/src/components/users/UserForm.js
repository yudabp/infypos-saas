import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { editUser } from "../../store/action/userAction";
import ImagePicker from "../../shared/image-picker/ImagePicker";
import {
    getAvatarName,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import user from "../../assets/images/avatar.png";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllRoles } from "../../store/action/roleAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-input-2";
import PhoneNumber from "libphonenumber-js";

const UserForm = (props) => {
    const {
        addUserData,
        id,
        singleUser,
        isEdit,
        isCreate,
        fetchAllRoles,
        roles,
        stores,
        frontSetting
    } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userValue, setUserValue] = useState({
        first_name: singleUser ? singleUser[0].first_name : "",
        last_name: singleUser ? singleUser[0].last_name : "",
        email: singleUser ? singleUser[0].email : "",
        phone: singleUser ? singleUser[0].phone : "",
        password: "",
        confirm_password: "",
        role_id: singleUser ? singleUser[0].role_id.value : "",
        image: singleUser ? singleUser[0].image : "",
        stores: singleUser ? singleUser[0].stores : [],
    });
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        role_id: "",
        stores: "",
    });
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });

    const [isValidPhone, setIsValidPhone] = useState(false);
    const [selectStore, setSelectStore] = useState([]);

    const avatarName = getAvatarName(
        singleUser &&
        singleUser[0].image === "" &&
        singleUser[0].first_name &&
        singleUser[0].last_name &&
        singleUser[0].first_name + " " + singleUser[0].last_name
    );
    const newImg =
        singleUser &&
        singleUser[0].image &&
        singleUser[0].image === null &&
        avatarName;
    const [imagePreviewUrl, setImagePreviewUrl] = useState(newImg && newImg);
    const [selectImg, setSelectImg] = useState(null);
    const disabled = selectImg
        ? false
        : singleUser &&
        singleUser[0].first_name === userValue.first_name &&
        singleUser[0].last_name === userValue.last_name &&
        singleUser[0].email === userValue.email &&
        singleUser[0].phone === userValue.phone &&
        singleUser[0].image === userValue.image &&
        singleUser[0].role_id.label === userValue.role_id.label;

    const [selectedRole] = useState(
        singleUser && singleUser[0]
            ? [
                {
                    label: singleUser[0].role_id.label,
                    value: singleUser[0].role_id.value,
                },
            ]
            : null
    );

    useEffect(() => {
        fetchAllRoles();
        setImagePreviewUrl(
            singleUser ? singleUser[0].image && singleUser[0].image : user
        );
    }, []);

    const onRolesChange = (obj) => {
        setUserValue((productValue) => ({ ...productValue, role_id: obj }));
        setErrors("");
    };

    useEffect(() => {
        if (isEdit && userValue.phone) {
            setIsValidPhone(true);
        }
        if (singleUser && singleUser.length === 1 && singleUser[0]?.stores) {
            const storeData = singleUser[0].stores;
            setSelectStore(storeData);
        }
    }, [isEdit]);

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (!userValue["first_name"]) {
            errorss["first_name"] = getFormattedMessage(
                "user.input.first-name.validate.label"
            );
        } else if (!userValue["last_name"]) {
            errorss["last_name"] = getFormattedMessage(
                "user.input.last-name.validate.label"
            );
        } else if (!EmailValidator.validate(userValue["email"])) {
            if (!userValue["email"]) {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.validate.label"
                );
            } else {
                errorss["email"] = getFormattedMessage(
                    "globally.input.email.valid.validate.label"
                );
            }
        } else if (!userValue["phone"]) {
            errorss["phone"] = getFormattedMessage(
                "globally.input.phone-number.validate.label"
            );
        } else if (isValidPhone === false) {
            errorss["phone"] = getFormattedMessage(
                "user.input.valid.phone-number.validate.label"
            );
        } else if (!isEdit && !userValue["password"]) {
            errorss["password"] = getFormattedMessage(
                "user.input.password.validate.label"
            );
        } else if (!isEdit && userValue["password"]?.length < 6) {
            errorss["password"] = getFormattedMessage(
                "user.input.password.length.validate.label"
            );
        } else if (!isEdit && !userValue["confirm_password"]) {
            errorss["confirm_password"] = getFormattedMessage(
                "user.input.confirm-password.validate.label"
            );
        } else if (!isEdit && userValue["password"] !== userValue["confirm_password"]) {
            errorss["confirm_password"] = getFormattedMessage(
                "reset-password.password.validate.label"
            );
        } else if (!userValue["role_id"]) {
            errorss["role_id"] = getFormattedMessage(
                "user.input.role.validate.label"
            );
        } else if (!userValue["stores"].length) {
            errorss["stores"] = getFormattedMessage(
                "store.field.must.required.validate"
            );
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const validatePhoneNumber = (phoneNumber, country) => {
        const number = PhoneNumber('+' + phoneNumber, country?.countryCode);
        if (number?.isValid()) {
            return setIsValidPhone(true);
        } else {
            return setIsValidPhone(false);
        }
    };

    const onChangeInput = (e, country) => {
        if (e.target.name === 'phone') {
            validatePhoneNumber(e.target.value, country)
        }

        setUserValue((inputs) => ({
            ...inputs,
            [e.target.name]: e.target.value,
        }));
        setErrors("");
    };

    const handleChanged = (event, store) => {
        const { name, checked } = event.target;
        let storeData = [...selectStore];
        if (name === "all_check") {
            if (checked) {
                storeData = stores?.filter(item => item.attributes?.status === 1)?.map(store => store.id);
            } else {
                storeData = [];
            }
        } else {
            if (checked) {
                storeData.push(store.id);
            } else {
                storeData = storeData.filter(id => id !== store.id);
            }
        }
        setSelectStore(storeData);
        setUserValue((productValue) => ({ ...productValue, stores: storeData }));
    };
    
    const handleImageChanges = (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/svg+xml") {
                setSelectImg(file);
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    setImagePreviewUrl(fileReader.result);
                };
                fileReader.readAsDataURL(file);
                setErrors("");
            }
        }
    };

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("stores", data.stores);
        if (!isEdit) {
            formData.append("password", data.password);
            formData.append("confirm_password", data.confirm_password);
        }
        if (data.role_id.value) {
            formData.append("role_id", data.role_id.value);
        } else {
            formData.append("role_id", data.role_id);
        }
        if (selectImg) {
            formData.append("image", data.image);
        }
        return formData;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        userValue.image = selectImg;
        const valid = handleValidation();
        if (singleUser && valid) {
            if (!disabled) {
                userValue.image = selectImg;
                dispatch(editUser(id, prepareFormData(userValue), navigate));
            }
        } else {
            if (valid) {
                setUserValue(userValue);
                addUserData(prepareFormData(userValue));
                setImagePreviewUrl(imagePreviewUrl ? imagePreviewUrl : user);
            }
        }
    };
    const handleHideShowPassword = (type) => {
        if (type === "new") {
            setShowPassword({ ...showPassword, new: !showPassword.new });
        } else if (type === "confirm") {
            setShowPassword({
                ...showPassword,
                confirm: !showPassword.confirm,
            });
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <Form>
                    <div className="row">
                        <div className="mb-4">
                            <ImagePicker
                                user={user}
                                isCreate={isCreate}
                                avtarName={avatarName}
                                imageTitle={placeholderText(
                                    "globally.input.change-image.tooltip"
                                )}
                                imagePreviewUrl={imagePreviewUrl}
                                handleImageChange={handleImageChanges}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label
                                htmlFor="exampleInputEmail1"
                                className="form-label"
                            >
                                {getFormattedMessage(
                                    "user.input.first-name.label"
                                )}{" "}
                                :<span className="required" />
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={userValue.first_name}
                                placeholder={placeholderText(
                                    "user.input.first-name.placeholder.label"
                                )}
                                className="form-control"
                                autoFocus={true}
                                onChange={(e) => onChangeInput(e)}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["first_name"]
                                    ? errors["first_name"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "user.input.last-name.label"
                                )}
                                :
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="last_name"
                                className="form-control"
                                placeholder={placeholderText(
                                    "user.input.last-name.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={userValue.last_name}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["last_name"]
                                    ? errors["last_name"]
                                    : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage("globally.input.email.label")}:
                            </label>
                            <span className="required" />
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                placeholder={placeholderText(
                                    "globally.input.email.placeholder.label"
                                )}
                                onChange={(e) => onChangeInput(e)}
                                value={userValue.email}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["email"] ? errors["email"] : null}
                            </span>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                {getFormattedMessage(
                                    "globally.input.phone-number.label"
                                )}
                                :
                            </label>
                            <span className="required" />

                            <PhoneInput
                                country={frontSetting.value?.default_country_code ?? "in"}
                                placeholder={placeholderText("globally.input.phone-number.placeholder.label")}
                                value={userValue.phone}
                                onChange={(phone, country) => onChangeInput({ target: { name: "phone", value: phone } }, country)}
                                containerClass="phone-input-container"
                                inputClass="form-control"
                                inputProps={{
                                    name: "phone",
                                    required: true,
                                }}
                                enableSearch={true}
                            />
                            <span className="text-danger d-block fw-400 fs-small mt-2">
                                {errors["phone"] ? errors["phone"] : null}
                            </span>
                        </div>
                        {isEdit ? (
                            ""
                        ) : (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "user.input.password.label"
                                    )}
                                    :
                                </label>
                                <span className="required" />
                                <div className="input-group">
                                    <input
                                        type={
                                            showPassword.new
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder={placeholderText(
                                            "user.input.password.placeholder.label"
                                        )}
                                        className="form-control"
                                        value={userValue.password}
                                        onChange={(e) => onChangeInput(e)}
                                    />
                                    <span
                                        className="showpassword"
                                        onClick={() =>
                                            handleHideShowPassword("new")
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                showPassword.new
                                                    ? faEye
                                                    : faEyeSlash
                                            }
                                            className="top-0 m-0 fa"
                                        />
                                    </span>
                                </div>
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["password"]
                                        ? errors["password"]
                                        : null}
                                </span>
                            </div>
                        )}
                        {isEdit ? (
                            ""
                        ) : (
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    {getFormattedMessage(
                                        "user.input.confirm-password.label"
                                    )}
                                    :
                                </label>
                                <span className="required" />
                                <div className="input-group">
                                    <input
                                        type={
                                            showPassword.confirm
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirm_password"
                                        className="form-control"
                                        placeholder={placeholderText(
                                            "user.input.confirm-password.placeholder.label"
                                        )}
                                        onChange={(e) => onChangeInput(e)}
                                        value={userValue.confirm_password}
                                    />
                                    <span
                                        className="showpassword"
                                        onClick={() =>
                                            handleHideShowPassword("confirm")
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                showPassword.confirm
                                                    ? faEye
                                                    : faEyeSlash
                                            }
                                            className="top-0 m-0 fa"
                                        />
                                    </span>
                                </div>
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["confirm_password"]
                                        ? errors["confirm_password"]
                                        : null}
                                </span>
                            </div>
                        )}
                        <div className="col-md-6">
                            <ReactSelect
                                title={getFormattedMessage(
                                    "role.title"
                                )}
                                placeholder={placeholderText(
                                    "user.input.role.placeholder.label"
                                )}
                                defaultValue={selectedRole}
                                data={roles}
                                onChange={onRolesChange}
                                errors={errors["role_id"]}
                            />
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12 mb-3">
                                <div className="row">
                                    <div className="d-flex col-md-12 flex-wrap align-items-center">
                                        <label
                                            className="form-label"
                                        >
                                            {getFormattedMessage(
                                                "store.title"
                                            )}
                                            <span className="required" />
                                            :
                                        </label>
                                        <div className="d-flex col-md-6 flex-wrap ps-5">
                                            <div className="col-md-12">
                                                <label
                                                    className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label"
                                                >
                                                    <input type="checkbox" 
                                                        checked={
                                                            stores.filter(store => store.attributes.status !== 0).length > 0 &&
                                                            selectStore.length === stores.filter(store => store.attributes.status !== 0).length
                                                        }
                                                        name="all_check"
                                                        onChange={(event) => handleChanged(event)}
                                                        className="me-3 form-check-input cursor-pointer" />
                                                    <div className="control__indicator" />
                                                    {getFormattedMessage("select.all.store.title")}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex col-md-12 flex-wrap">
                                        {stores
                                        .filter(store => store.attributes.status !== 0)
                                        .map((store, index) => (
                                            <div className="col-md-3" key={index}>
                                                <label
                                                    className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-3 cursor-pointer custom-label"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={store.attributes.name}
                                                        value={store.attributes.name}
                                                        checked={selectStore.includes(store.id)}
                                                        onChange={(event) => handleChanged(event, store)}
                                                        className="me-3 form-check-input cursor-pointer"
                                                    />
                                                    <div className="control__indicator" />
                                                    {getFormattedMessage(store.attributes.name)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-danger d-block fw-400 fs-small mt-2">
                                        {errors["stores"] ? errors["stores"] : null}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ModelFooter
                            onEditRecord={singleUser}
                            onSubmit={onSubmit}
                            editDisabled={disabled}
                            link="/user/users"
                            addDisabled={!userValue.first_name}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const { roles, stores, frontSetting } = state;
    return { roles, stores, frontSetting };
};

export default connect(mapStateToProps, { fetchAllRoles })(UserForm);
