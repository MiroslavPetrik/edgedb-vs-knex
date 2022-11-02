"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
const $ = __importStar(require("../reflection"));
const _ = __importStar(require("../imports"));
const AccessKind = $.makeType(_.spec, "dda561f9-50cc-11ed-b0b3-fd6813b1abdd", _.syntax.literal);

const AccessPolicyAction = $.makeType(_.spec, "dda4a7b6-50cc-11ed-8563-513ddc575a88", _.syntax.literal);

const Cardinality = $.makeType(_.spec, "dd9f9953-50cc-11ed-bd15-318381210bca", _.syntax.literal);

const OperatorKind = $.makeType(_.spec, "dda1c878-50cc-11ed-9b6a-d3db8892fb6a", _.syntax.literal);

const ParameterKind = $.makeType(_.spec, "dda33e4e-50cc-11ed-a8ee-430e5a733b65", _.syntax.literal);

const SourceDeleteAction = $.makeType(_.spec, "dda113f3-50cc-11ed-a8ba-bd261c549dda", _.syntax.literal);

const TargetDeleteAction = $.makeType(_.spec, "dda057bb-50cc-11ed-b425-970a40130e1c", _.syntax.literal);

const TypeModifier = $.makeType(_.spec, "dda3f3b9-50cc-11ed-8e81-776f7fa4a8a3", _.syntax.literal);

const Volatility = $.makeType(_.spec, "dda2855e-50cc-11ed-aab3-fb5389184800", _.syntax.literal);

const $Object_dda643a650cc11eda4f065cef810c22d = $.makeType(_.spec, "dda643a6-50cc-11ed-a4f0-65cef810c22d", _.syntax.literal);

const Object_dda643a650cc11eda4f065cef810c22d= _.syntax.$PathNode($.$toSet($Object_dda643a650cc11eda4f065cef810c22d, $.Cardinality.Many), null);

const $SubclassableObject = $.makeType(_.spec, "ddb21252-50cc-11ed-95ad-2f29a096caec", _.syntax.literal);

const SubclassableObject= _.syntax.$PathNode($.$toSet($SubclassableObject, $.Cardinality.Many), null);

const $InheritingObject = $.makeType(_.spec, "df009cf2-50cc-11ed-8d52-771435224ec3", _.syntax.literal);

const InheritingObject= _.syntax.$PathNode($.$toSet($InheritingObject, $.Cardinality.Many), null);

const $AnnotationSubject = $.makeType(_.spec, "ded5446d-50cc-11ed-9b80-cdd81043ac5e", _.syntax.literal);

const AnnotationSubject= _.syntax.$PathNode($.$toSet($AnnotationSubject, $.Cardinality.Many), null);

const $AccessPolicy = $.makeType(_.spec, "e037280f-50cc-11ed-8f7e-1fc3bb2cdc5a", _.syntax.literal);

const AccessPolicy= _.syntax.$PathNode($.$toSet($AccessPolicy, $.Cardinality.Many), null);

const $Alias = $.makeType(_.spec, "e06d519a-50cc-11ed-a56d-4f2c96102291", _.syntax.literal);

const Alias= _.syntax.$PathNode($.$toSet($Alias, $.Cardinality.Many), null);

const $Annotation = $.makeType(_.spec, "dee2d5da-50cc-11ed-aeff-33bc76bf2741", _.syntax.literal);

const Annotation= _.syntax.$PathNode($.$toSet($Annotation, $.Cardinality.Many), null);

const $Type = $.makeType(_.spec, "ddc3990c-50cc-11ed-b524-c7d8e17bf1cf", _.syntax.literal);

const Type= _.syntax.$PathNode($.$toSet($Type, $.Cardinality.Many), null);

const $PrimitiveType = $.makeType(_.spec, "de2ff93b-50cc-11ed-947a-e76d2fec727a", _.syntax.literal);

const PrimitiveType= _.syntax.$PathNode($.$toSet($PrimitiveType, $.Cardinality.Many), null);

const $CollectionType = $.makeType(_.spec, "de46fc15-50cc-11ed-bf10-8ff0d6563e2b", _.syntax.literal);

const CollectionType= _.syntax.$PathNode($.$toSet($CollectionType, $.Cardinality.Many), null);

const $Array = $.makeType(_.spec, "de5ecf70-50cc-11ed-8ded-1b89223c60f5", _.syntax.literal);

const Array= _.syntax.$PathNode($.$toSet($Array, $.Cardinality.Many), null);

const $CallableObject = $.makeType(_.spec, "df3497ad-50cc-11ed-a2c4-df812630f080", _.syntax.literal);

const CallableObject= _.syntax.$PathNode($.$toSet($CallableObject, $.Cardinality.Many), null);

const $VolatilitySubject = $.makeType(_.spec, "df5453fb-50cc-11ed-822e-1b865e998e70", _.syntax.literal);

const VolatilitySubject= _.syntax.$PathNode($.$toSet($VolatilitySubject, $.Cardinality.Many), null);

const $Cast = $.makeType(_.spec, "e382ae5d-50cc-11ed-8d18-5314a110aedb", _.syntax.literal);

const Cast= _.syntax.$PathNode($.$toSet($Cast, $.Cardinality.Many), null);

const $ConsistencySubject = $.makeType(_.spec, "df9db757-50cc-11ed-bfe7-e7898d0bed19", _.syntax.literal);

const ConsistencySubject= _.syntax.$PathNode($.$toSet($ConsistencySubject, $.Cardinality.Many), null);

const $Constraint = $.makeType(_.spec, "df643b70-50cc-11ed-abee-75755b0df089", _.syntax.literal);

const Constraint= _.syntax.$PathNode($.$toSet($Constraint, $.Cardinality.Many), null);

const $Delta = $.makeType(_.spec, "dec48514-50cc-11ed-9eb2-ed72d6d37905", _.syntax.literal);

const Delta= _.syntax.$PathNode($.$toSet($Delta, $.Cardinality.Many), null);

const $Extension = $.makeType(_.spec, "e3d599ba-50cc-11ed-b8f4-55f2bf57c522", _.syntax.literal);

const Extension= _.syntax.$PathNode($.$toSet($Extension, $.Cardinality.Many), null);

const $Function = $.makeType(_.spec, "e31cb6a1-50cc-11ed-a975-492615db729d", _.syntax.literal);

const Function= _.syntax.$PathNode($.$toSet($Function, $.Cardinality.Many), null);

const $Global = $.makeType(_.spec, "e2f46209-50cc-11ed-803b-5f034f5ed9b1", _.syntax.literal);

const Global= _.syntax.$PathNode($.$toSet($Global, $.Cardinality.Many), null);

const $Index = $.makeType(_.spec, "dfb9a3d7-50cc-11ed-88a8-1b888bdf68fa", _.syntax.literal);

const Index= _.syntax.$PathNode($.$toSet($Index, $.Cardinality.Many), null);

const $Pointer = $.makeType(_.spec, "dffd320a-50cc-11ed-90f8-fb2d7cad867a", _.syntax.literal);

const Pointer= _.syntax.$PathNode($.$toSet($Pointer, $.Cardinality.Many), null);

const $Source = $.makeType(_.spec, "dfe48843-50cc-11ed-b81b-ef371b53c431", _.syntax.literal);

const Source= _.syntax.$PathNode($.$toSet($Source, $.Cardinality.Many), null);

const $Link = $.makeType(_.spec, "e1dc8851-50cc-11ed-b1bf-2b53538e8fe1", _.syntax.literal);

const Link= _.syntax.$PathNode($.$toSet($Link, $.Cardinality.Many), null);

const $Migration = $.makeType(_.spec, "e3b073f5-50cc-11ed-9044-736a48b90f2b", _.syntax.literal);

const Migration= _.syntax.$PathNode($.$toSet($Migration, $.Cardinality.Many), null);

const $Module = $.makeType(_.spec, "de23b687-50cc-11ed-8288-e1beba9becc4", _.syntax.literal);

const Module= _.syntax.$PathNode($.$toSet($Module, $.Cardinality.Many), null);

const $ObjectType = $.makeType(_.spec, "e0d15263-50cc-11ed-996a-9185098330c9", _.syntax.literal);

const ObjectType= _.syntax.$PathNode($.$toSet($ObjectType, $.Cardinality.Many), null);

const $Operator = $.makeType(_.spec, "e350c4fc-50cc-11ed-97e7-d9ac5e3682c3", _.syntax.literal);

const Operator= _.syntax.$PathNode($.$toSet($Operator, $.Cardinality.Many), null);

const $Parameter = $.makeType(_.spec, "df1f765a-50cc-11ed-b53b-7f2d9f07568e", _.syntax.literal);

const Parameter= _.syntax.$PathNode($.$toSet($Parameter, $.Cardinality.Many), null);

const $Property = $.makeType(_.spec, "e271af59-50cc-11ed-94af-6183e988553b", _.syntax.literal);

const Property= _.syntax.$PathNode($.$toSet($Property, $.Cardinality.Many), null);

const $PseudoType = $.makeType(_.spec, "de01b438-50cc-11ed-998f-e5bdedfb4d3b", _.syntax.literal);

const PseudoType= _.syntax.$PathNode($.$toSet($PseudoType, $.Cardinality.Many), null);

const $Range = $.makeType(_.spec, "dea7e241-50cc-11ed-83e2-d59b73798760", _.syntax.literal);

const Range= _.syntax.$PathNode($.$toSet($Range, $.Cardinality.Many), null);

const $ScalarType = $.makeType(_.spec, "e08aff42-50cc-11ed-b903-c3f973ab7011", _.syntax.literal);

const ScalarType= _.syntax.$PathNode($.$toSet($ScalarType, $.Cardinality.Many), null);

const $Tuple = $.makeType(_.spec, "de86b5df-50cc-11ed-a060-41bfc70956d5", _.syntax.literal);

const Tuple= _.syntax.$PathNode($.$toSet($Tuple, $.Cardinality.Many), null);

const $TupleElement = $.makeType(_.spec, "de7bf23c-50cc-11ed-8a03-5b180bb35672", _.syntax.literal);

const TupleElement= _.syntax.$PathNode($.$toSet($TupleElement, $.Cardinality.Many), null);



Object.assign(exports, { AccessKind: AccessKind, AccessPolicyAction: AccessPolicyAction, Cardinality: Cardinality, OperatorKind: OperatorKind, ParameterKind: ParameterKind, SourceDeleteAction: SourceDeleteAction, TargetDeleteAction: TargetDeleteAction, TypeModifier: TypeModifier, Volatility: Volatility, $Object_dda643a650cc11eda4f065cef810c22d: $Object_dda643a650cc11eda4f065cef810c22d, Object_dda643a650cc11eda4f065cef810c22d: Object_dda643a650cc11eda4f065cef810c22d, $SubclassableObject: $SubclassableObject, SubclassableObject: SubclassableObject, $InheritingObject: $InheritingObject, InheritingObject: InheritingObject, $AnnotationSubject: $AnnotationSubject, AnnotationSubject: AnnotationSubject, $AccessPolicy: $AccessPolicy, AccessPolicy: AccessPolicy, $Alias: $Alias, Alias: Alias, $Annotation: $Annotation, Annotation: Annotation, $Type: $Type, Type: Type, $PrimitiveType: $PrimitiveType, PrimitiveType: PrimitiveType, $CollectionType: $CollectionType, CollectionType: CollectionType, $Array: $Array, Array: Array, $CallableObject: $CallableObject, CallableObject: CallableObject, $VolatilitySubject: $VolatilitySubject, VolatilitySubject: VolatilitySubject, $Cast: $Cast, Cast: Cast, $ConsistencySubject: $ConsistencySubject, ConsistencySubject: ConsistencySubject, $Constraint: $Constraint, Constraint: Constraint, $Delta: $Delta, Delta: Delta, $Extension: $Extension, Extension: Extension, $Function: $Function, Function: Function, $Global: $Global, Global: Global, $Index: $Index, Index: Index, $Pointer: $Pointer, Pointer: Pointer, $Source: $Source, Source: Source, $Link: $Link, Link: Link, $Migration: $Migration, Migration: Migration, $Module: $Module, Module: Module, $ObjectType: $ObjectType, ObjectType: ObjectType, $Operator: $Operator, Operator: Operator, $Parameter: $Parameter, Parameter: Parameter, $Property: $Property, Property: Property, $PseudoType: $PseudoType, PseudoType: PseudoType, $Range: $Range, Range: Range, $ScalarType: $ScalarType, ScalarType: ScalarType, $Tuple: $Tuple, Tuple: Tuple, $TupleElement: $TupleElement, TupleElement: TupleElement });

const __defaultExports = {
  "AccessKind": AccessKind,
  "AccessPolicyAction": AccessPolicyAction,
  "Cardinality": Cardinality,
  "OperatorKind": OperatorKind,
  "ParameterKind": ParameterKind,
  "SourceDeleteAction": SourceDeleteAction,
  "TargetDeleteAction": TargetDeleteAction,
  "TypeModifier": TypeModifier,
  "Volatility": Volatility,
  "Object": Object_dda643a650cc11eda4f065cef810c22d,
  "SubclassableObject": SubclassableObject,
  "InheritingObject": InheritingObject,
  "AnnotationSubject": AnnotationSubject,
  "AccessPolicy": AccessPolicy,
  "Alias": Alias,
  "Annotation": Annotation,
  "Type": Type,
  "PrimitiveType": PrimitiveType,
  "CollectionType": CollectionType,
  "Array": Array,
  "CallableObject": CallableObject,
  "VolatilitySubject": VolatilitySubject,
  "Cast": Cast,
  "ConsistencySubject": ConsistencySubject,
  "Constraint": Constraint,
  "Delta": Delta,
  "Extension": Extension,
  "Function": Function,
  "Global": Global,
  "Index": Index,
  "Pointer": Pointer,
  "Source": Source,
  "Link": Link,
  "Migration": Migration,
  "Module": Module,
  "ObjectType": ObjectType,
  "Operator": Operator,
  "Parameter": Parameter,
  "Property": Property,
  "PseudoType": PseudoType,
  "Range": Range,
  "ScalarType": ScalarType,
  "Tuple": Tuple,
  "TupleElement": TupleElement
};
exports.default = __defaultExports;
