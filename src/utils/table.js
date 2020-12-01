import { getToken } from './auth';

/**
 * 上传图片
 */
export function $_upload(_self, initData, file) {
    return new Promise((resolve, reject) => {
        let token = getToken();
        _self[initData] = {
            'Authorization': token
        };

        const isImage = file.type.indexOf("image") != -1,
            isLt5M = file.size / 1024 / 1024 < 5;
        // 这里常规检验，看项目需求而定
        if (!isImage) {
            _self.$message.error("只能上传图片格式png 、jpg/jpeg!");
            reject(false);
        }
        if (!isLt5M) {
            _self.$message.error("只能上传图片大小小于5M");
            reject(false);
        }
        resolve(true);
    });
}