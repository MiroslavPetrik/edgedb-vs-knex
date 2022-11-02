"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveShapeElement = exports.select = exports.shape = exports.$existingScopes = exports.$selectify = exports.delete = exports.$handleModifiers = exports.is = exports.EMPTY_LAST = exports.EMPTY_FIRST = exports.DESC = exports.ASC = void 0;
const edgedb_1 = require("edgedb");
const index_1 = require("edgedb/dist/reflection/index.js");
const hydrate_1 = require("./hydrate");
const cardinality_1 = require("./cardinality");
const path_1 = require("./path");
const literal_1 = require("./literal");
const __spec__1 = require("./__spec__");
const castMaps_1 = require("./castMaps");
exports.ASC = "ASC";
exports.DESC = "DESC";
exports.EMPTY_FIRST = "EMPTY FIRST";
exports.EMPTY_LAST = "EMPTY LAST";
function is(expr, shape) {
    const mappedShape = {};
    for (const [key, value] of Object.entries(shape)) {
        mappedShape[key] = {
            __kind__: index_1.ExpressionKind.PolyShapeElement,
            __polyType__: expr,
            __shapeElement__: value
        };
    }
    return mappedShape;
}
exports.is = is;
function $handleModifiers(modifiers, params) {
    const { root, scope } = params;
    const mods = {
        singleton: !!modifiers["filter_single"]
    };
    let card = root.__cardinality__;
    if (modifiers.filter) {
        mods.filter = modifiers.filter;
    }
    if (modifiers.filter_single) {
        if (root.__element__.__kind__ !== index_1.TypeKind.object) {
            throw new Error("filter_single can only be used with object types");
        }
        card = index_1.Cardinality.AtMostOne;
        const fs = modifiers.filter_single;
        if (fs.__element__) {
            mods.filter = modifiers.filter_single;
        }
        else {
            const exprs = Object.keys(fs).map(key => {
                const val = fs[key].__element__
                    ? fs[key]
                    : literal_1.literal(root.__element__["__pointers__"][key]["target"], fs[key]);
                return (0, path_1.$expressionify)({
                    __element__: {
                        __name__: "std::bool",
                        __kind__: index_1.TypeKind.scalar
                    },
                    __cardinality__: index_1.Cardinality.One,
                    __kind__: index_1.ExpressionKind.Operator,
                    __opkind__: index_1.OperatorKind.Infix,
                    __name__: "=",
                    __args__: [scope[key], val]
                });
            });
            if (exprs.length === 1) {
                mods.filter = exprs[0];
            }
            else {
                mods.filter = exprs.reduce((a, b) => {
                    return (0, path_1.$expressionify)({
                        __element__: {
                            __name__: "std::bool",
                            __kind__: index_1.TypeKind.scalar
                        },
                        __cardinality__: index_1.Cardinality.One,
                        __kind__: index_1.ExpressionKind.Operator,
                        __opkind__: index_1.OperatorKind.Infix,
                        __name__: "and",
                        __args__: [a, b]
                    });
                });
            }
        }
    }
    if (modifiers.order_by) {
        const orderExprs = Array.isArray(modifiers.order_by)
            ? modifiers.order_by
            : [modifiers.order_by];
        mods.order_by = orderExprs.map(expr => typeof expr.__element__ === "undefined"
            ? expr
            : { expression: expr });
    }
    if (modifiers.offset) {
        mods.offset =
            typeof modifiers.offset === "number"
                ? (0, literal_1.$getTypeByName)("std::number")(modifiers.offset)
                : modifiers.offset;
        card = cardinality_1.cardutil.overrideLowerBound(card, "Zero");
    }
    if (modifiers.limit) {
        let expr;
        if (typeof modifiers.limit === "number") {
            expr = (0, literal_1.$getTypeByName)("std::number")(modifiers.limit);
        }
        else if (modifiers.limit.__kind__ === index_1.ExpressionKind.Set) {
            expr = modifiers.limit.__exprs__[0];
        }
        else {
            throw new Error("Invalid value for `limit` modifier");
        }
        mods.limit = expr;
        card = cardinality_1.cardutil.overrideLowerBound(card, "Zero");
    }
    return { modifiers: mods, cardinality: card };
}
exports.$handleModifiers = $handleModifiers;
function deleteExpr(expr, modifiersGetter) {
    const selectExpr = select(expr, modifiersGetter);
    return (0, path_1.$expressionify)({
        __kind__: index_1.ExpressionKind.Delete,
        __element__: selectExpr.__element__,
        __cardinality__: selectExpr.__cardinality__,
        __expr__: selectExpr
    });
}
exports.delete = deleteExpr;
function $selectify(expr) {
    return expr;
}
exports.$selectify = $selectify;
const $FreeObject = (0, hydrate_1.makeType)(__spec__1.spec, [...__spec__1.spec.values()].find(s => s.name === "std::FreeObject").id, literal_1.literal);
const FreeObject = {
    __kind__: index_1.ExpressionKind.PathNode,
    __element__: $FreeObject,
    __cardinality__: index_1.Cardinality.One,
    __parent__: null,
    __exclusive__: true,
    __scopeRoot__: null
};
exports.$existingScopes = new Set();
function $shape(_a, b) {
    return b;
}
exports.shape = $shape;
function select(...args) {
    const firstArg = args[0];
    if (typeof firstArg !== "object" ||
        firstArg instanceof Uint8Array ||
        firstArg instanceof Date ||
        firstArg instanceof edgedb_1.Duration ||
        firstArg instanceof edgedb_1.LocalDateTime ||
        firstArg instanceof edgedb_1.LocalDate ||
        firstArg instanceof edgedb_1.LocalTime ||
        firstArg instanceof edgedb_1.RelativeDuration ||
        firstArg instanceof edgedb_1.DateDuration ||
        firstArg instanceof edgedb_1.ConfigMemory) {
        const literalExpr = (0, castMaps_1.literalToTypeSet)(firstArg);
        return (0, path_1.$expressionify)($selectify({
            __kind__: index_1.ExpressionKind.Select,
            __element__: literalExpr.__element__,
            __cardinality__: literalExpr.__cardinality__,
            __expr__: literalExpr,
            __modifiers__: {}
        }));
    }
    const exprPair = typeof args[0].__element__ !== "undefined"
        ? args
        : [FreeObject, () => args[0]];
    let expr = exprPair[0];
    const shapeGetter = exprPair[1];
    if (expr === FreeObject) {
        const freeObjectPtrs = {};
        for (const [k, v] of Object.entries(args[0])) {
            freeObjectPtrs[k] = {
                __kind__: v.__element__.__kind__ === index_1.TypeKind.object ? "link" : "property",
                target: v.__element__,
                cardinality: v.__cardinality__,
                exclusive: false,
                computed: true,
                readonly: true,
                hasDefault: false,
                properties: {}
            };
        }
        expr = {
            ...FreeObject,
            __element__: {
                ...FreeObject.__element__,
                __pointers__: {
                    ...FreeObject.__element__.__pointers__,
                    ...freeObjectPtrs
                }
            }
        };
    }
    if (!shapeGetter) {
        if (expr.__element__.__kind__ === index_1.TypeKind.object) {
            const objectExpr = expr;
            return (0, path_1.$expressionify)($selectify({
                __kind__: index_1.ExpressionKind.Select,
                __element__: {
                    __kind__: index_1.TypeKind.object,
                    __name__: `${objectExpr.__element__.__name__}`,
                    __pointers__: objectExpr.__element__.__pointers__,
                    __shape__: objectExpr.__element__.__shape__
                },
                __cardinality__: objectExpr.__cardinality__,
                __expr__: objectExpr,
                __modifiers__: {}
            }));
        }
        else {
            return (0, path_1.$expressionify)($selectify({
                __kind__: index_1.ExpressionKind.Select,
                __element__: expr.__element__,
                __cardinality__: expr.__cardinality__,
                __expr__: expr,
                __modifiers__: {}
            }));
        }
    }
    const cleanScopedExprs = exports.$existingScopes.size === 0;
    const { modifiers: mods, shape, scope } = resolveShape(shapeGetter, expr);
    if (cleanScopedExprs) {
        exports.$existingScopes.clear();
    }
    const { modifiers, cardinality } = $handleModifiers(mods, { root: expr, scope });
    return (0, path_1.$expressionify)($selectify({
        __kind__: index_1.ExpressionKind.Select,
        __element__: expr.__element__.__kind__ === index_1.TypeKind.object
            ? {
                __kind__: index_1.TypeKind.object,
                __name__: `${expr.__element__.__name__}`,
                __pointers__: expr.__element__.__pointers__,
                __shape__: shape
            }
            : expr.__element__,
        __cardinality__: cardinality,
        __expr__: expr,
        __modifiers__: modifiers,
        __scope__: expr !== scope
            ? scope
            : undefined
    }));
}
exports.select = select;
function resolveShape(shapeGetter, expr) {
    const modifiers = {};
    const shape = {};
    const scope = expr.__element__.__kind__ === index_1.TypeKind.object
        ? (0, path_1.$getScopedExpr)(expr, exports.$existingScopes)
        : expr;
    const selectShape = typeof shapeGetter === "function" ? shapeGetter(scope) : shapeGetter;
    for (const [key, value] of Object.entries(selectShape)) {
        if (key === "filter" ||
            key === "filter_single" ||
            key === "order_by" ||
            key === "offset" ||
            key === "limit") {
            modifiers[key] = value;
        }
        else {
            if (expr.__element__.__kind__ !== index_1.TypeKind.object) {
                throw new Error(`Invalid select shape key '${key}' on scalar expression, ` +
                    `only modifiers are allowed (filter, order_by, offset and limit)`);
            }
            shape[key] = resolveShapeElement(key, value, scope);
        }
    }
    return { shape, modifiers, scope };
}
function resolveShapeElement(key, value, scope) {
    var _b, _c, _d, _e, _f;
    const isSubshape = typeof value === "object" &&
        typeof value.__kind__ === "undefined";
    const isClosure = typeof value === "function" &&
        ((_b = scope.__element__.__pointers__[key]) === null || _b === void 0 ? void 0 : _b.__kind__) === "link";
    if (isSubshape || isClosure) {
        const childExpr = scope[key];
        if (!childExpr) {
            throw new Error(`Invalid shape element "${key}" for type ${scope.__element__.__name__}`);
        }
        const { shape: childShape, scope: childScope, modifiers: mods } = resolveShape(value, childExpr);
        const { modifiers } = $handleModifiers(mods, {
            root: childExpr,
            scope: childScope
        });
        return {
            __kind__: index_1.ExpressionKind.Select,
            __element__: {
                __kind__: index_1.TypeKind.object,
                __name__: `${childExpr.__element__.__name__}`,
                __pointers__: childExpr.__element__.__pointers__,
                __shape__: childShape
            },
            __cardinality__: ((_d = (_c = scope.__element__.__pointers__) === null || _c === void 0 ? void 0 : _c[key]) === null || _d === void 0 ? void 0 : _d.cardinality) ||
                ((_f = (_e = scope.__element__.__shape__) === null || _e === void 0 ? void 0 : _e[key]) === null || _f === void 0 ? void 0 : _f.__cardinality__),
            __expr__: childExpr,
            __modifiers__: modifiers,
            __scope__: childExpr !== childScope ? childScope : undefined
        };
    }
    else if ((value === null || value === void 0 ? void 0 : value.__kind__) === index_1.ExpressionKind.PolyShapeElement) {
        const polyElement = value;
        const polyScope = scope.is(polyElement.__polyType__);
        return {
            __kind__: index_1.ExpressionKind.PolyShapeElement,
            __polyType__: polyScope,
            __shapeElement__: resolveShapeElement(key, polyElement.__shapeElement__, polyScope)
        };
    }
    else if (typeof value === "boolean" && key.startsWith("@")) {
        const linkProp = scope[key];
        if (!linkProp) {
            throw new Error(scope.__parent__
                ? `link property '${key}' does not exist on link ${scope.__parent__.linkName}`
                : `cannot select link property '${key}' on an object (${scope.__element__.__name__})`);
        }
        return value ? linkProp : false;
    }
    else {
        return value;
    }
}
exports.resolveShapeElement = resolveShapeElement;
