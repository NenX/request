"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var antd_1 = require("antd");
var umi_request_1 = require("umi-request");
var getErrData_1 = __importDefault(require("./getErrData"));
var antd_2 = require("antd");
var store_1 = __importDefault(require("store"));
var intervalSet = new Set();
var Request = (function () {
    function Request() {
        var _this = this;
        this._request = null;
        this.init = function (configs) {
            if (configs === void 0) { configs = {}; }
            var errHandler = configs.errHandler, others = __rest(configs, ["errHandler"]);
            _this._request = umi_request_1.extend(__assign({ timeout: 5000, credentials: 'include', headers: {
                    Accept: 'application/json',
                }, errorHandler: function (arg) {
                    var response = arg.response, request = arg.request;
                    if (response) {
                        var errorData = getErrData_1.default(response);
                        errHandler && errHandler(errorData);
                        return Promise.reject(errorData);
                    }
                    else if (request) {
                        var options = request.options, url = request.url;
                        if (options && !options.hideErr) {
                            var host = url.slice(url.indexOf('://') + 3);
                            host = host.slice(0, url.indexOf('/'));
                            antd_2.notification.error({
                                message: host + " \u672A\u54CD\u5E94",
                            });
                        }
                        return Promise.reject(url + " no response");
                    }
                    return Promise.reject(arg);
                } }, others));
            _this.intercept();
        };
        this.init();
    }
    Request.prototype.intercept = function () {
        var _this = this;
        ['get', 'post', 'put', 'delete'].forEach(function (_) {
            _this[_] = (function (url, options) {
                if (options === void 0) { options = {}; }
                var loading = options.loading, interval = options.interval, cacheWhenFailed = options.cacheWhenFailed;
                var key = _ + ':' + url;
                if (typeof interval === 'number') {
                    if (intervalSet.has(key)) {
                        return Promise.reject('interval !');
                    }
                    intervalSet.add(key);
                    setTimeout(function () {
                        intervalSet.delete(key);
                    }, interval);
                }
                var promise = _this._request[_](url, options);
                if (loading !== undefined) {
                    var hide_1 = antd_1.message.loading(loading, 0);
                    return promise.finally(function () {
                        hide_1();
                    });
                }
                if (cacheWhenFailed) {
                    return promise.then(function (value) {
                        store_1.default.set(key, value);
                        return value;
                    }).catch(function (err) {
                        console.log('cacheWhenFailed');
                        return store_1.default.get(key);
                    });
                }
                return promise;
            });
        });
    };
    return Request;
}());
exports.default = Request;
