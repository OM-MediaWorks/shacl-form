import { Validator } from 'shacl-engine'
import { Parser, Store } from 'n3'
import rdfDataset from '@rdfjs/dataset'
import factory from 'rdf-ext'
import DatasetCore from '@rdfjs/dataset/DatasetCore'
import { sh, rdf } from '../helpers/namespaces'
import { createRoot } from 'react-dom/client'
import { createElement, StrictMode } from 'react'
import { FormLevelBase } from '../components/FormLevel'
import { shaclTree } from './shaclTree'
import { LocalizationProvider } from '@fluent/react';
import { l10n } from './l10n'
import type { Root } from 'react-dom/client'
import type { Options, NamedNode, GrapoiPointer, Literal } from '../types'
import grapoi from 'grapoi'
import '../scss/style.scss'
import { swapSubject } from '../helpers/swapSubject'

export const init = (options: Options) => {

  /**
   * A customElement to render SHACL as a form.
   * 
   * @attribute subject - Useful when creating data. It will set the subject to this uri.
   * @attribute shacl-url - The place where the SHACL turtle is stored, it should allow CORS.
   * @attribute shape-uri - Set this attribute if you have multiple shapes in your shape turtle file and do not want to use the first shape.
   */
  class ShaclForm extends HTMLElement {

    #validator: typeof Validator
    #subject: NamedNode = factory.namedNode('')
    #store: Store = new Store()
    #shaclDataset: DatasetCore = rdfDataset.dataset()
    shapeUris: Array<NamedNode> = []
    #rootShaclIri: NamedNode = factory.namedNode('')
    #root: Root
    #uiLanguagePriorities: Array<string> = ['*']
    #data: GrapoiPointer = {} as GrapoiPointer

    constructor () {
      super()
      this.init()
      this.#root = createRoot(this)
    }

    async init () {
      this.classList.add('shacl-form')
      const parser = new Parser()
      const shaclUrl = this.attributes.getNamedItem('shacl-url')?.value
      if (!shaclUrl) throw new Error('A shacl-url property is required. It should link to a SHACL turtle file')
      const shaclText = await fetch(shaclUrl).then(response => response.text())
      const shaclQuads = await parser.parse(shaclText)
      this.#shaclDataset = rdfDataset.dataset(shaclQuads)
      this.#validator = new Validator(this.#shaclDataset, { coverage: true, factory, details: true })

      const nodeShapeQuads = this.#shaclDataset.match(null, rdf('type'), sh('NodeShape'))
      for (const nodeShapeQuad of nodeShapeQuads) {
        this.shapeUris.push(nodeShapeQuad.subject as NamedNode)
      }

      if (this.shapeUris.length === 1) this.#rootShaclIri = this.shapeUris[0]
      const shaclIri = this.attributes.getNamedItem('shacl-iri')?.value

      if (shaclIri) this.#rootShaclIri = factory.namedNode(shaclIri)

      const dataUrl = this.attributes.getNamedItem('data-url')?.value
      if (dataUrl) {
        const dataText = await fetch(dataUrl).then(response => response.text())
        if (dataText) {
          const dataQuads = await parser.parse(dataText)
          await this.#store.addQuads(dataQuads)
          if (dataQuads?.[0]?.subject) this.#subject = dataQuads[0].subject as NamedNode  
        }
      }

      if (this.getAttribute('data-iri')) {
        this.#subject = factory.namedNode(this.getAttribute('data-iri') ?? 'urn:default-shacl-form-subject')
      }

      this.#uiLanguagePriorities = this.getAttribute('ui-language-priorities')?.split(',') ?? ['*']
      this.#uiLanguagePriorities.push('*')
      this.render()

      this.#data = grapoi({ dataset: this.#store, factory, term: this.#subject })

      if (!this.attributes.getNamedItem('content-languages')) {
        const contentLanguages = new Set()
        for (const quad of this.#store) {
          if ((quad.object as Literal).language) {
            contentLanguages.add((quad.object as Literal).language)
          }
        }
        
        this.setAttribute('content-languages', [...contentLanguages.values()].join(','))
      }
    }

    get subject () {
      return this.#subject
    }

    async render () {
      const report = await this.validate()
      const tree = shaclTree(report, this.#shaclDataset, options, this.#rootShaclIri)

      this.#root.render(createElement(LocalizationProvider, { l10n, children: [
        createElement(StrictMode, {
          key: 'strictmode',
          children: [
            createElement(FormLevelBase, { 
              form: this,
              tree, 
              dataPointer: this.#data,
              key: 'form', 
              uiLanguagePriorities: this.#uiLanguagePriorities 
            })
          ]
        })
      ]}))
    }

    set subject (newValue: NamedNode) {
      swapSubject(this.#store, this.subject, newValue)
    }

    validate () {
      return this.#validator.validate({ dataset: this.#store, terms: [this.subject] })
    }

    get shapeUri () {
      const givenShapeUri = this.attributes.getNamedItem('shape-uri')?.value
      if (!givenShapeUri) return this.shapeUris[0]

      const foundUri = this.shapeUris.find(term => term.value === givenShapeUri)
      if (foundUri) return foundUri

      throw new Error('Could not find the shape uri')
    }

    get contentLanguages () {
      return (this.closest(`[content-languages]`) as HTMLDivElement)?.getAttribute('content-languages')?.split(',') ?? []
    }
  
    get activeContentLanguages () {
      const activeContentLanguages = (this.closest(`[active-content-languages]`) as HTMLDivElement)?.getAttribute('active-content-languages')?.split(',') ?? []
      if (!activeContentLanguages.every(activeContentLanguage => this.contentLanguages.includes(activeContentLanguage))) throw new Error(`An active language was set that is not included in the available languages.`)
      if (activeContentLanguages.length === 0) return this.contentLanguages
      return activeContentLanguages
    }

  }

  customElements.define('shacl-form', ShaclForm)
}