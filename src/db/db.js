export const originalStatus = [
  {
    id: 0,
    label: "征税放行"
  },
  {
    id: 3,
    label: "退运"
  },
  {
    id: 4,
    label: "入仓"
  },
  {
    id: 5,
    label: "免税放行"
  }
];

// 原始状态：0:征税放行,1:征税放行,删除税单,2:征税放行,不删除税单,3:退运,4:入仓,5:免税放行

// 修改状态：7:免税放行,0:放行,1:放行,删除税号,2:放行,不删除税号,3:退单,4:退运,5:查验,6:入仓
export const applyModifyStatus = [
  {
    id: 0,
    label: "征税放行"
  },
  {
    id: 3,
    label: "退单"
  },
  {
    id: 4,
    label: "退运"
  },
  {
    id: 5,
    label: "查验"
  },
  {
    id: 6,
    label: "入仓"
  },
  {
    id: 7,
    label: "免税放行"
  }
];

export const holdReason = [
  { key: 1, label: "电脑审单入仓" },
  { key: 2, label: "收件人拒付税款、拒收邮件，现退境外" },
  { key: 3, label: "货物报关" },
  { key: 4, label: "邮件逾期不处理，退回寄件人" },
  { key: 5, label: "补充申报" },
  { key: 6, label: "寄件人申请退回" },
  { key: 7, label: "文物鉴定" },
  { key: 8, label: "收件人申请退回" },
  { key: 9, label: "涉嫌违规" },
  { key: 10, label: "货物报关放行出仓" },
  { key: 11, label: "涉嫌侵权" },
  { key: 12, label: "征税放行出仓" },
  { key: 13, label: "音像审查" },
  { key: 14, label: "免税放行出仓" },
  { key: 15, label: "外交邮件" },
  { key: 16, label: "录入错误，退单重报" },
  { key: 17, label: "其他" }
];

export const outWareholdReason = [
  { key: 1, label: "收件人拒付税款、拒收邮件，现退境外" },
  { key: 2, label: "邮件逾期不处理，退回寄件人" },
  { key: 3, label: "寄件人申请退回" },
  { key: 4, label: "收件人申请退回" },
  { key: 5, label: "货物报关放行出仓" },
  { key: 6, label: "征税放行出仓" },
  { key: 7, label: "免税放行出仓" },
  { key: 8, label: "录入错误，退单重报" },
  { key: 9, label: "其他" }
];
