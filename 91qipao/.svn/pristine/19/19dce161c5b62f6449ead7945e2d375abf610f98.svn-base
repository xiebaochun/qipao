/**
 * 弹出选择列表插件
 * 此组件依赖 listpcker ，请在页面中先引入 mui.listpicker.css + mui.listpicker.js
 * varstion 1.0.1
 * by Houfeng
 * Houfeng@DCloud.io
 */

(function($,jquery, document) {

	var panelBuffer = '<div class="mui-poppicker">\
		<div class="mui-poppicker-header">\
			<button class="mui-btn mui-poppicker-btn-cancel">取消</button>\
			<button class="mui-btn" style="position:absolute;width:50px;margin-left:-25px;left:50%;color:#333;font-size:15px;">城市</button>\
			<button class="mui-btn mui-btn-blue mui-poppicker-btn-ok">确定</button>\
			<div class="mui-poppicker-clear"></div>\
		</div>\
		<div class="mui-poppicker-body">\
		</div>\
	</div>';
	var panelBuffer2 = '<div class="mui-poppicker">\
		<div class="mui-poppicker-header">\
			<button class="mui-btn mui-poppicker-btn-cancel">取消</button>\
			<button class="mui-btn" style="position:absolute;width:90px;margin-left:-40px;left:50%;color:#333;font-size:15px;">星座</button>\
			<button class="mui-btn mui-btn-blue mui-poppicker-btn-ok">确定</button>\
			<div class="mui-poppicker-clear"></div>\
		</div>\
		<div class="mui-poppicker-body">\
		</div>\
	</div>';

	var pickerBuffer = '<div class="mui-listpicker">\
		<div class="mui-listpicker-inner">\
			<ul>\
			</ul>\
		</div>\
	</div>';

	//定义弹出选择器类
	var PopPicker = $.PopPicker = $.Class.extend({
		//构造函数
		init: function(options) {
			var self = this;
			self.options = options || {type:0};
			self.options.buttons = self.options.buttons || ['取消', '确定'];
			self.panel = $.dom(panelBuffer)[0];
			if(options.type == 1){
				self.panel = $.dom(panelBuffer2)[0];
			}
			document.body.appendChild(self.panel);
			self.ok = self.panel.querySelector('.mui-poppicker-btn-ok');
			self.cancel = self.panel.querySelector('.mui-poppicker-btn-cancel');
			self.body = self.panel.querySelector('.mui-poppicker-body');
			self.mask = $.createMask();
			self.cancel.innerText = self.options.buttons[0];
			self.ok.innerText = self.options.buttons[1];
			self.cancel.addEventListener('click', function(event) {
				self.hide();
				event.cancelBubble = true;
			}, false);
			self.ok.addEventListener('click', function(event) {
				if (self.callback) {
					var rs = self.callback(self.getSelectedItems());
					if (rs !== false) {
						self.hide();
					}
				}
				event.cancelBubble = true;
			}, false);
			self.mask[0].addEventListener('click', function() {
				self.hide();
				event.cancelBubble = true;
			}, false);
			self._createListPicker();

			jquery('#fixed-bg').click(function(){
				self.hide();
			});
		},
		_createListPicker: function() {
			var self = this;
			var layer = self.options.layer || 1;
			var width = (100 / layer) + '%';
			self.pickers = [];
			for (var i = 1; i <= layer; i++) {
				var picker = $.dom(pickerBuffer)[0];
				picker.style.width = width;
				self.body.appendChild(picker);
				$(picker).listpicker();
				self.pickers.push(picker);
				picker.addEventListener('change', function(event) {
					var nextPicker = this.nextSibling;
					if (nextPicker && nextPicker.listpickerId) {
						var eventData = event.detail || {};
						var preItem = eventData.item || {};
						nextPicker.setItems(preItem.children);
					}
				}, false);
			}
		},
		//填充数据
		setData: function(data) {
			var self = this;
			data = data || [];
			self.pickers[0].setItems(data);
		},
		//获取选中的项（数组）
		getSelectedItems: function() {
			var self = this;
			var items = [];
			for (var i in self.pickers) {
				var picker = self.pickers[i];
				items.push(picker.getSelectedItem() || {});
			}
			return items;
		},
		//显示
		show: function(callback) {
			var self = this;
			self.callback = callback;
			//jquery('.mui-poppicker').show();
			self.mask.show();
			document.body.classList.add($.className('poppicker-active-for-page'));
			self.panel.classList.add($.className('active'));
		},
		//隐藏
		hide: function() {
			isPop = false;
			var self = this;
			jquery('#fixed-bg').hide();
			jquery('.mui-poppicker').remove();
			if (self.disposed) return;
			self.panel.classList.remove($.className('active'));
			self.mask.close();
			document.body.classList.remove($.className('poppicker-active-for-page'));
		},
		dispose: function() {
			var self = this;
			self.hide();
			setTimeout(function() {
				self.panel.parentNode.removeChild(self.panel);
				for (var name in self) {
					self[name] = null;
					delete self[name];
				};
				self.disposed = true;
			}, 300);
		}
	});
	
})(mui,$, document);