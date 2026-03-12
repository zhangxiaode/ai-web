export const formatTradeStatus = (val: string) => {
	switch (val){
		case 'SUCCESS':
			return '支付成功'
		case 'REFUND':
			return '转入退款'
		case 'NOTPAY':
			return '未支付'
		case 'CLOSED':
			return '已关闭'
		case 'REVOKED':
			return '已撤销'
		case 'USERPAYING':
			return '用户支付中'
		case 'PAYERROR':
			return '支付失败'
		default:
			return '未知错误'
	}
}