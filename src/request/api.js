import request from './request';

// let baseUrl = 'http://172.28.1.76:8888';
let baseUrl = 'http://10.194.69.43:8888';

// switch (process.env.NODE_ENV) {
//     case 'production':
//         baseUrl = "http://10.194.69.43:8888";   //生产环境url
//         break;
//     case 'development':
//         baseUrl = 'http://172.28.1.76:8888';  // 开发
//         break;
// }

export const BASE_URL = baseUrl;

// 登录
export const LoginApi = (data) => request.post(baseUrl + '/auth/login', data);

// updatePassword
export const updatePassword = (data) => request.post(baseUrl + '/auth/updatePassword', data);

// 查询订单列表
export const approvalList = (data) => request.post(baseUrl + '/approval/common/approvalList', data);

// 查询订单列表
export const approvalDetaiL = (data) => request.post(baseUrl + '/approval/common/approvalDetail', data);

// 获取用户信息
export const personal = () => request.post(baseUrl + '/approval/personal/data');

// 查询邮件信息
export const queryReMailInfo = (data) => request.post(baseUrl + '/approval/applicant/common/queryReMailInfo', data);

// 上传图片
export const uploadImage = (data) => request.post(baseUrl + '/approval/applicant/upload/image', data);

// 重投申请
// 创建重投申请单
export const createStatusApproval = (data) => request.post(baseUrl + '/approval/applicant/createStatusApproval', data);
// 修改重投申请单
export const modifyStatusApproval = (data) => request.post(baseUrl + '/approval/applicant/modifyStatusApproval', data);
// 审核提交
export const approvalAction = (data) => request.post(baseUrl + '/approval/common/approvalAction', data);


// 出仓申请
// 创建申请单
export const createOutWarehouseApproval = (data) => request.post(baseUrl + '/approval/applicant/createOutWarehouseApproval', data);
// 修改申请单
export const modifyOutWarehouseApproval = (data) => request.post(baseUrl + '/approval/applicant/modifyOutWarehouseApproval', data);


// 补充申请
// 创建
export const createSupplementaryDeclarationApproval = (data) => request.post(baseUrl + '/approval/applicant/createSupplementaryDeclarationApproval', data);
// 修改
export const modifySupplementaryDeclarationApproval = (data) => request.post(baseUrl + '/approval/applicant/modifySupplementaryDeclarationApproval', data);
// 审核
export const supplementaryDeclaration = (data) => request.post(baseUrl + '/approval/common/SupplementaryDeclaration/customhouse', data);


// 印刷品申请
// 创建
export const createPrintedAudioVideoTransferApproval = (data) => request.post(baseUrl + '/approval/applicant/createPrintedAudioVideoTransferApproval', data);

// 修改
export const modifyPrintedAudioVideoTransferApproval = (data) => request.post(baseUrl + '/approval/applicant/modifyPrintedAudioVideoTransferApproval', data);

// 修改
export const printedAudioVideoTransfer = (data) => request.post(baseUrl + '/approval/common/PrintedAudioVideoTransfer/customhouse', data);

// 查询邮件信息用于出仓申请
export const querySupplementaryDeclaration = (data) => request.post(baseUrl + '/approval/applicant/outWarehouse/querySupplementaryDeclaration', data);

// 查询邮件信息，用于发起出仓申请。可分页
export const queryPrintedAudioVideoTransfer = (data) => request.post(baseUrl + '/approval/applicant/PrintedAudioVideoTransfer/queryTransfer', data);

// 上传
// 批量单号查询
export const batchQueryMailInfo = (data) => request.post(baseUrl + '/approval/applicant/common/batchQueryMailInfo', data);

// 批量单号查询
export const uploadFile = (data) => request.post(baseUrl + '/approval/applicant/upload/file', data);