"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactWindow = require("react-window");
var _reactDnd = require("react-dnd");
var _reactDndHtml5Backend = require("react-dnd-html5-backend");
var _TreeItem = _interopRequireDefault(require("./TreeItem"));
var _flattenTree = _interopRequireDefault(require("../utils/flattenTree"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var TreeList = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
  var treeData = _ref.treeData,
    _ref$itemHeight = _ref.itemHeight,
    itemHeight = _ref$itemHeight === void 0 ? 25 : _ref$itemHeight,
    _ref$indentSize = _ref.indentSize,
    indentSize = _ref$indentSize === void 0 ? 20 : _ref$indentSize,
    onMoveItem = _ref.onMoveItem;
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    flattenedData = _useState2[0],
    setFlattenedData = _useState2[1];
  (0, _react.useEffect)(function () {
    var flattened = [];
    (0, _flattenTree["default"])(treeData, 0, flattened);
    setFlattenedData(flattened);
  }, [treeData]);
  var moveItem = function moveItem(dragIndex, hoverIndex) {
    var updatedData = _toConsumableArray(flattenedData);
    var _updatedData$splice = updatedData.splice(dragIndex, 1),
      _updatedData$splice2 = _slicedToArray(_updatedData$splice, 1),
      draggedItem = _updatedData$splice2[0];
    updatedData.splice(hoverIndex, 0, draggedItem);
    setFlattenedData(updatedData);
    if (onMoveItem) {
      onMoveItem(dragIndex, hoverIndex);
    }
  };
  return /*#__PURE__*/_react["default"].createElement(_reactDnd.DndProvider, {
    backend: _reactDndHtml5Backend.HTML5Backend
  }, /*#__PURE__*/_react["default"].createElement(_reactWindow.FixedSizeList, {
    ref: ref,
    height: 500,
    itemCount: flattenedData.length,
    itemSize: itemHeight,
    width: "100%",
    itemData: flattenedData
  }, function (_ref2) {
    var index = _ref2.index,
      style = _ref2.style,
      data = _ref2.data;
    return /*#__PURE__*/_react["default"].createElement(_TreeItem["default"], {
      key: data[index].id,
      index: index,
      style: style,
      data: data,
      moveItem: moveItem
    });
  }));
});
var _default = exports["default"] = TreeList;