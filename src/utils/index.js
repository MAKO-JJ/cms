/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

function uploadImg(params) {
  console.log(params);
  const file = params.file,
    fileType = file.type,
    isImage = fileType.indexOf("image") != -1,
    isLt5M = file.size / 1024 / 1024 < 5;
  // 这里常规检验，看项目需求而定
  if (!isImage) {
    this.$message.error("只能上传图片格式png 、jpg/jpeg!");
    this.fileList.pop();
    return;
  }
  if (!isLt5M) {
    this.$message.error("只能上传图片大小小于5M");
    this.fileList.pop();
    return;
  }
  let loadingInstance = Loading.service({
    target: ".inner_upload",
    text: "上传中",
  });
  // 根据后台需求数据格式
  const form = new FormData();
  // 文件对象
  form.append("file", file);
  uploadImage(form)
    .then((res) => {
      this.ruleForm.photo.push({
        name: res.data.fileName,
        uid: params.uid,
      });

      this.$nextTick(() => {
        loadingInstance.close();
      });
      Message.success("上传图片成功");
    })
    .catch((err) => {
      // 删除最后一个
      this.fileList.pop();

      this.$nextTick(() => {
        loadingInstance.close();
      });
    });
}
