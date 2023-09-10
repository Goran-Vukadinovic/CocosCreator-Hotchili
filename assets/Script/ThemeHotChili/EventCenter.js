// EventCenter
EventCenter = {
	_events: {},
};

// EventCell
EventCell = cc.Class({
    name:"EventCell",
    ctor:function(){
		var eventName = arguments[0];
		var fun = arguments[1];
		var handler = arguments[2];
        this.eventName = eventName;
		this.fun = fun;
		this.handler = handler;
    }
});

// 注册事件监听，可以对同一个eventName有多个观察者，分别为事件名，函数，函数所属对象
EventCenter.registerEvent = function(eventName, fun, handler) {
	if (!eventName || eventName === "") {
		console.log("EventCenter registerEvent error 事件名称不能为空");
		return;
	}
	if (!fun || !handler) {
		console.log("EventCenter registerEvent error fun and handler 不能为空");
		return;
	}

	if (!this._events[eventName]) {
		this._events[eventName] = [];
	}

	for (let i = 0; i < this._events[eventName].length; i++) {
		// 如果已经有了一模一样的监听者就跳过
		if (this._events[eventName][i].eventName === eventName &&
			this._events[eventName][i].fun === fun &&
			this._events[eventName][i].handler === handler) {
			return;
		}
	}

	this._events[eventName].push(new EventCell(eventName, fun, handler));
};

// 广播事件，对所有监听该事件的观察者进行广播
EventCenter.pushEvent = function(eventName, data) {
	if (!this._events[eventName]) {
		console.log(`EventCenter pushEvent error 没有对应注册事件: ${eventName}`);
		return;
	}

	const tempFuncTable = [];
	for (let i = 0; i < this._events[eventName].length; i++) {
		// 如果已经有了一模一样的监听者就跳过
		if (this._events[eventName][i].eventName === eventName) {
			const tempFun = this._events[eventName][i].fun;
			const tempHandler = this._events[eventName][i].handler;
			const tempData = data;
			const tempEventName = eventName;
			tempFuncTable.push(function() {
				if (tempHandler) {
					console.log(`pushEvent success, eventName = ${tempEventName}`);
					tempFun(tempHandler, tempData);
				} else {
					console.log(`pushEvent fail, handler is null, eventName = ${tempEventName}`);
				}
			});
		}
	}

	for (let i = 0; i < tempFuncTable.length; i++) {
		tempFuncTable[i]();
	}
};
// 删除指定事件的观察者（可以只删除指定观察者，也可以一并删除所有观察者）
EventCenter.removeEvent = function(eventName, fun, handler) {
	if (!this._events[eventName]) {
		console.log(`EventCenter removeEvent error 没有对应删除事件: ${eventName}`);
		return;
	}

	for (let i = 0; i < this._events[eventName].length; i++) {
		// 如果已经有了一模一样的监听者就跳过
		if (this._events[eventName][i].eventName === eventName &&
			this._events[eventName][i].fun === fun &&
			this._events[eventName][i].handler === handler) {
			this._events[eventName].splice(i, 1); // remove element from array
			break;
		}
	}

	if (!Object.keys(this._events[eventName]).length) {
		delete this._events[eventName];
	}
};
