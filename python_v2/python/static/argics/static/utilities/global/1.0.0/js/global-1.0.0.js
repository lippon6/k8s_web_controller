
/* global util */
function showErrorResponse(data) {

	if(data && data.err) {
		if(data.processing) {
			if(data.processing == 'login')
				;//never happen
			else// if(data.processing == 'show')
				showMessageBox(data.message,'业务逻辑受限',null,data.detail);
		}
		else showMessageBox(data.message,'出错了',null,data.detail);
		return false;
	}
	else return true;
}
function showMessageBox(message, title, callback, detail, width, height, detailBoxHeight) {
	var obj = setParentWindow();
	if(obj == null)
	{
		return false;
	}
	obj.getModelboxChain().message(message, title, callback, detail, width, height, detailBoxHeight);
}
function showConfirmBox(message, title, callback, detail, width, height, detailBoxHeight) {
	var obj = setParentWindow();
	if(obj == null)
	{
		return false;
	}
	obj.getModelboxChain().confirm(message, title, callback, detail, width, height, detailBoxHeight);
}
function showAutoHiddenMessageBox(message, title, callback, detail, width, height, detailBoxHeight) {
	var obj = setParentWindow();
	if(obj == null)
	{
		return false;
	}
	obj.getMessaegBox().message(message, title, callback, detail, width, height, detailBoxHeight);
}
function getGlobalDialogChain() {
	return getDialogChain();
}
function showLoadingBox(message, title, width, height) {
	getLoadingboxChain().loading(message, title, width, height);
}
function closeLoadingBox() {
	getLoadingboxChain().close();
}
//收缩所有select的下来列表//不然会遮挡下拉菜单
function selectBlur() {
	jQuery('select').blur();
	jQuery('iframe').each(function() {
		this.contentWindow.selectBlur();
	});
}

function setParentWindow()
{
	if(undefined != this.globalobj)
	{
		return this;
	}else{
		if(undefined != parent.globalobj)
		{
			return parent;
		}else{
			if(undefined != parent.parent.globalobj)
			{
				return parent.parent;
			}else{
				if(undefined != parent.parent.parent.globalobj)
				{
					return parent.parent.parent;
				}else{
					if(undefined != parent.parent.parent.parent.globalobj)
					{
						return parent.parent.parent.parent;
					}else{
						if( undefined != parent.parent.parent.parent.parent.globalobj)
						{
							return parent.parent.parent.parent.parent;
						}else{
							return null;
						}
					}
				}
			}
		}
	}
}
