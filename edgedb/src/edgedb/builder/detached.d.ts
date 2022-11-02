import { ExpressionKind } from "edgedb/dist/reflection/index";
import type { Expression, TypeSet } from "./typesystem";
export declare function detached<Expr extends TypeSet>(expr: Expr): $expr_Detached<Expr>;
export declare type $expr_Detached<Expr extends TypeSet = TypeSet> = Expression<{
    __element__: Expr["__element__"];
    __cardinality__: Expr["__cardinality__"];
    __kind__: ExpressionKind.Detached;
    __expr__: TypeSet;
}>;
