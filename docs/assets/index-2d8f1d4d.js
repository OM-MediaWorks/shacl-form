var __defProp=Object.defineProperty;var __name=(target,value)=>__defProp(target,"name",{value,configurable:!0});import{a as sh,j as jsxRuntimeExports}from"./index-0ca3f396.js";import{S as ShaclFormSingleEditorReact}from"./ShaclFormSingleEditorReact-fa9a19a7.js";import"./ShaclFormSingleEditor-852a3b3c.js";const _EnumSelect=class _EnumSelect extends ShaclFormSingleEditorReact{template(){var _a,_b;const options=[...this.shaclPointer.out([sh("in")]).list()].map(pointer=>pointer.value);return jsxRuntimeExports.jsx("div",{className:"d-flex",children:jsxRuntimeExports.jsxs("select",{className:"form-select",defaultValue:(_a=this.value)==null?void 0:_a.value,onChange:event=>{this.value=this.df.literal(event.target.value)},children:[(_b=this.value)!=null&&_b.value?null:jsxRuntimeExports.jsx("option",{children:"- Select -"}),options.map(option=>jsxRuntimeExports.jsx("option",{value:option,children:option},option))]})})}};__name(_EnumSelect,"EnumSelect");let EnumSelect=_EnumSelect;export{EnumSelect as default};
