import type { NamedNode, Quad, Term } from '@rdfjs/types'
import { ShaclFormEditorSingle } from './core/ShaclFormEditorSingle'
import { GeocoderBase } from './plugins/GeoCoder/GeoCoderBase'
import { FileUploaderBase } from './plugins/FileUploader/FileUploaderBase'
export type { BlankNode, Literal, Quad, Variable, NamedNode, Term } from '@rdfjs/types'

export type ShaclProperties = {
  description?: { [key: string]: string },
  group?: string,
  languageIn?: Array<string>,
  minCount?: number,
  name?: { [key: string]: string },
  order?: number,
  qualifiedMaxCount?: number,
  qualifiedMinCount?: number,
  uniqueLang?: boolean
  path?: string
}

export type GrapoiPointer = {
  in: (predicates?: Array<NamedNode>, objects?: Array<NamedNode>) => GrapoiPointer
  out: (predicates?: Array<NamedNode | null>, subjects?: Array<NamedNode>) => GrapoiPointer,
  hasOut: (predicates?: Array<NamedNode | null>, subjects?: Array<NamedNode>) => GrapoiPointer
  deleteOut: (predicates?: Array<any> | any, objects?: Array<any> | any) => GrapoiPointer,
  addOut: (predicates?: Array<any> | any, objects?: Array<any> | any) => GrapoiPointer,
  quads: () => Array<Quad>
  trim(): GrapoiPointer
  distinct(): GrapoiPointer
  values: Array<any>
  filter: (item: any) => boolean
  value: any
  isList: () => Boolean,
  list: () => Array<GrapoiPointer>
  ptrs: Array<any>
  clone: (data: any) => GrapoiPointer  
  node: (pointers?: Array<any>) => GrapoiPointer
  execute: (paths: Array<any>) => GrapoiPointer
  replace: (replacement: any) => GrapoiPointer
  term: Term
  terms: Array<Term>
  [Symbol.iterator]: () => Iterator<any>
}

export type Options = {
  widgets: {
    single: {
      [key: string]: any
    }
    merged: {
      [key: string]: any
    }
  },
  groups: {
    [key: string]: any
  },
  enhancer: any,
  plugins: {
    geocoder?: GeocoderBase,
    fileuploader?: FileUploaderBase
  }
}

export type Alternative = {
  
}

export type Widget = {
  _shaclPointer: GrapoiPointer,
  _score: number,
  _alternative: Alternative,
  _widget: any,
  _predicate: NamedNode,
  _path: Array<any>,
  _pathPart: Array<any>,
  _messages: {
    errors: Array<string>,
    infos: Array<string>,
    warnings: Array<string>
  },
  _element: ShaclFormEditorSingle<any>
  _fields: Array<any>,
  _mapping: {
    [key: string]: NamedNode
  }
}

export type TreeItem = {
  _shaclPointers: Array<GrapoiPointer>,
  _messages: {
    errors: Array<string>,
    infos: Array<string>,
    warnings: Array<string>
  },
  _pathPart: any,
  _types: Array<string>,
  _alternatives: Array<any>
  _widgets: Array<any>
}

export type UnifiedGeoSearch = {
  locality: string,
  number: string,
  region: string,
  country: string,
  street: string,
  postalCode: string
  latitude?: number,
  longitude?: number,
}

export type ShaclFormType = HTMLDivElement & { 
  render: () => null,
  contentLanguages: Array<string>,
  activeContentLanguages: Array<string>
  activeContentLanguage: string,
  options: Options
}