import { combineReducers } from "redux";
import loginReducers from "./authReducer";
import brandsReducers from "./brandsReducers";
import totalRecordReduce from "./totalRecordReduce";
import toastReducer from "./toastReducer";
import currencyReducer from "./currencyReducer";
import productCategoryReducers from "./productCategoryReducers";
import roleReducer from "./roleReducer";
import permissionReducer from "./permissionReducer";
import warehouseReducer from "./warehouseReducrs";
import unitsReducers from "./unitsReducres";
import supplierReducer from "./supplierReducer";
import customerReducer from "./customerReducer";
import userReducers from "./userReducers";
import expenseCategoryReducer from "./expenseCategoryReducer";
import expenseReducer from "./expenseReducer";
import productReducers from "./productReducers";
import settingReducers from "./settingReducers";
import purchaseProductReducer from "./purchaseProductReducer";
import changePasswordReducers from "./changePasswordReducers";
import posFetchProductReducers from "./pos/posFetchProductReducers";
import posAllProductReducers from "./pos/posAllProductReducres";
import loadingReducer from "./loadingReducer";
import updateProfileReducer from "./updateProfileReducer";
import productUnitReducers from "./productUnitReducers";
import frontSettingReducer from "./frontSettingReducer";
import posCashPaymentReducers from "./pos/posCashPaymentReducers";
import saleReducer from "./saleReducer";
import productSaleUnitReducers from "./productSaleUnitReducers";
import purchaseReducer from "./purchaseReducer";
import transfersReducer from "./transfersReducer";
import changeLanguageReducer from "./changeLanguageReducer";
import updateLanguageReducer from "./updateLanguageReducer";
import dashboardReducers from "./dashboardReducers";
import recentSaleDashboardReducer from "./recentSaleDashboardReducer";
import topSellingProductReducer from "./topSellingProductReducer";
import weekSalePurchaseReducer from "./weekSalePurchaseReducer";
import salesReturnReducer from "./salesReturnReducer";
import yearTopProductReducer from "./yearTopProductReducer";
import topCustomersReducer from "./topCustomersReducer";
import purchaseDetailsReducers from "./purchaseDetailsReducers";
import saleDetailsReducers from "./saleDetailsReducers";
import purchaseReturnReducers from "./purchaseReturnReducers";
import salesReturnDetailsReducer from "./salesReturnDetailsReducer";
import purchaseReturnDetailsReducers from "./purchaseReturnDetailsReducres";
import warehouseReportReducer from "./warehouseReportReducer";
import resetOptionReducer from "./resetOptionReducer";
import dateReducer from "./dateReducres";
import printQuantity from "./printQuantity";
import stockReportReducer from "./stockReportReducres";
import productQuantityReport from "./productQuantityReport";
import topSellingReportReducer from "./topSellingReportReducer";
import stockDetailsSaleTabReducers from "./stockDetailsSaleTabReducers";
import stockDetailsSaleReturnReducers from "./stockDetailsSaleReturnReducers";
import stockDetailsPurchaseReducer from "./stockDetilsPurchaseReducres";
import stockDetailsPurchaseReturnReducer from "./stockDetailsPurchaseReturnReducres";
import stockDetailsWarehouseReducer from "./stockDetailsWarehouseReducres";
import filterDropDownToggleReducer from "./filterDropDownToggleReducer";
import warehouseDisableReducer from "./warehouseDisableReducer";
import stockAlertReducer from "./stockAlertReducer";
import tokenValidationReducer from "./tokenValidationReducer";
import configReducer from "./configReducer";
import warehouseDetailsReducer from "./warehouseDetailsReducer";
import salePaymentReducer from "./salePaymentReducer";
import saleApiReducer from "./saleApiReducer";
import saveButtonReducer from "./saveButtonReducer";
import adjustMentReducer from "./adjustMentReducer";
import adjustMentDetailsReducer from "./adjustMentDetailsReducer";
import allSalePurchaseReducer from "./allSalePurchaseReducer";
import allConfigReducer from "./allConfigReducer";
import transferDetailsReducer from "./transferDetailsReducer";
import countryStateReducer from "./countryStateReducer";
import productUnitIdReducer from "./productUnitIdReducer";
import emailTemplatesReducer from "./emailTemplatesReducer";
import posRegisterDetailsReducer from "./pos/posRegisterDetailsReducer";
import dateFormatReducer from "./dateFormatReducer";
import suppliersReportReducer from "./suppliersReportReducer";
import supplierPurchaseReportReducer from "./supplierPurchaseReportReducer";
import supplierReportWidgetReducer from "./supplierReportWidgetReducer";
import quotationReducer from "./quotationReducer";
import quotationDetailsReducer from "./quotationDetailsReducer";
import updateBrandReducer from "./updateBrandReducer";
import defaultCountryReducer from "./defaultCountryReducer";
import smsApiReducer from "./smsApiReducer";
import mailSettingsReducer from "./mailSettingsReducer";
import bestCustomeReportReducer from "./bestCustomeReportReducer";
import smsTemplatesReducer from "./smsTemplatesReducer";
import profitAndLossReportReducer from "./profitAndLossReportReducer";
import customerReportReducer from "./customerReportReducer";
import customerReportWidgetReducer from "./customerReportWidgetReducer";
import customerPaymentReportReducer from "./customerPaymentReportReducer";
import HoldListReducer from "./pos/HoldListReducer";
import EditHoldList from "./pos/EditHoldList";
import languageReducer from "./languageReducer";
import languageDataReducer from "./languageDataReducer";
import baseUnitsReducres from "./baseUnitsReducres";
import baseUnitReducer from "./baseUnitReducer";
import posCloseRegisterDetailsReducer from "./pos/posCloseRegisterDetailsReducer";
import posRegisterReportDetailsReducer from "./pos/posRegisterReportDetailsReducer";
import variationReducer from "./variationReducer";
import receiptSettingsReducer from "./receiptSettingsReducer";
import adminUsersReducer from "./admin/adminUsersReducer";
import plansReducer from "./admin/plansReducer";
import subscriptionReducer from "./admin/subscriptionReducer";
import cashPaymentReducer from "./admin/cashPaymentReducer";
import adminSettingsReducer from "./admin/adminSettingsReducer";
import userPlansReducers from "./userPlansReducers";
import adminDashboardReducer from "./admin/adminDashboardReducer";
import transactionReducer from "./admin/transactionReducer";
import importProductApiReducer from "./importProductApiReducer";
import frontCMSReducer from "./admin/frontCMS/frontCMSReducer";
import inquiriesReducer from "./admin/inquiriesReducer";
import storeReducer from "./storeReducer";
import taxReducer from "./taxReducer";
import posSettingReducer from "./posSettingReducer";
import frontCmsReducer from "./frontCmsReducer";
import { cartReducer } from "./cartReducer";
import dualScreenReducer from "./dualScreenReducer";
import paymentMethodReducer from "./paymentMethodReducer";
import totalProductRecordReducer from "./totalProductRecordReducer";

export default combineReducers({
    loginUser: loginReducers,
    brands: brandsReducers,
    totalRecord: totalRecordReduce,
    toasts: toastReducer,
    currencies: currencyReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    warehouses: warehouseReducer,
    productCategories: productCategoryReducers,
    variations: variationReducer,
    units: unitsReducers,
    suppliers: supplierReducer,
    users: userReducers,
    customers: customerReducer,
    expenseCategories: expenseCategoryReducer,
    expenses: expenseReducer,
    products: productReducers,
    sales: saleReducer,
    productSales: productSaleUnitReducers,
    settings: settingReducers,
    purchaseProducts: purchaseProductReducer,
    purchases: purchaseReducer,
    tansfers: transfersReducer,
    changePasswords: changePasswordReducers,
    posFetchProducts: posFetchProductReducers,
    posAllProducts: posAllProductReducers,
    isLoading: loadingReducer,
    userProfile: updateProfileReducer,
    productUnits: productUnitReducers,
    frontSetting: frontSettingReducer,
    cashPayment: posCashPaymentReducers,
    selectedLanguage: changeLanguageReducer,
    updateLanguage: updateLanguageReducer,
    todayCount: dashboardReducers,
    recentSalesDashboard: recentSaleDashboardReducer,
    topSelling: topSellingProductReducer,
    weekSalePurchase: weekSalePurchaseReducer,
    yearTopProduct: yearTopProductReducer,
    topCustomers: topCustomersReducer,
    purchaseDetails: purchaseDetailsReducers,
    saleDetails: saleDetailsReducers,
    salesReturn: salesReturnReducer,
    purchaseReturn: purchaseReturnReducers,
    saleReturnDetails: salesReturnDetailsReducer,
    purchaseReturnDetails: purchaseReturnDetailsReducers,
    warehouseReportData: warehouseReportReducer,
    resetOption: resetOptionReducer,
    dates: dateReducer,
    printQuantity: printQuantity,
    stockReports: stockReportReducer,
    productQuantityReport: productQuantityReport,
    topSellingReport: topSellingReportReducer,
    stockDetailsSales: stockDetailsSaleTabReducers,
    stockDetailSaleReturn: stockDetailsSaleReturnReducers,
    stockDetailsPurchase: stockDetailsPurchaseReducer,
    stockDetailPurchaseReturn: stockDetailsPurchaseReturnReducer,
    stockWarehouse: stockDetailsWarehouseReducer,
    dropDownToggle: filterDropDownToggleReducer,
    isOptionDisabled: warehouseDisableReducer,
    stockAlertDetails: stockAlertReducer,
    tokenValidate: tokenValidationReducer,
    config: configReducer,
    warehouseDetails: warehouseDetailsReducer,
    allSalePayments: salePaymentReducer,
    isCallSaleApi: saleApiReducer,
    isSaving: saveButtonReducer,
    adjustments: adjustMentReducer,
    allSalePurchase: allSalePurchaseReducer,
    adjustmentsDetails: adjustMentDetailsReducer,
    allConfigData: allConfigReducer,
    countryState: countryStateReducer,
    productUnitId: productUnitIdReducer,
    emailTemplates: emailTemplatesReducer,
    posAllTodaySaleOverAllReport: posRegisterDetailsReducer,
    dateFormat: dateFormatReducer,
    allSupplierReport: suppliersReportReducer,
    supplierPurchaseReport: supplierPurchaseReportReducer,
    supplierReportWidgetData: supplierReportWidgetReducer,
    quotations: quotationReducer,
    quotationDetails: quotationDetailsReducer,
    isCallFetchDataApi: updateBrandReducer,
    mailSettingsData: mailSettingsReducer,
    smsTemplates: smsTemplatesReducer,
    bestCustomer: bestCustomeReportReducer,
    profitAndLossReport: profitAndLossReportReducer,
    allCustomerReport: customerReportReducer,
    customerReportWidgetData: customerReportWidgetReducer,
    customerPayment: customerPaymentReportReducer,
    transferDetails: transferDetailsReducer,
    defaultCountry: defaultCountryReducer,
    smsApiData: smsApiReducer,
    holdListData: HoldListReducer,
    editholdListData: EditHoldList,
    languages: languageReducer,
    language: languageDataReducer,
    baseUnits: baseUnitsReducres,
    base: baseUnitReducer,
    closeRegisterDetails: posCloseRegisterDetailsReducer,
    registerReportDetails: posRegisterReportDetailsReducer,
    receiptSettings: receiptSettingsReducer,
    adminUsers: adminUsersReducer,
    plans: plansReducer,
    subscriptions: subscriptionReducer,
    cashPayments: cashPaymentReducer,
    adminSetting: adminSettingsReducer,
    userPlans: userPlansReducers,
    adminDashboardData: adminDashboardReducer,
    transactions: transactionReducer,
    callAPIAfterImport: importProductApiReducer,
    frontCMS: frontCMSReducer,
    inquries: inquiriesReducer,
    stores: storeReducer,
    taxes: taxReducer,
    posSettings: posSettingReducer,
    frontCms: frontCmsReducer,
    cart: cartReducer,
    dualScreenSetting: dualScreenReducer,
    paymentMethods: paymentMethodReducer,
    totalProductRecord: totalProductRecordReducer
});
