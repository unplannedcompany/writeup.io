import 'normalize.css'
import './style/lib/codemirror.css'
import './style/layout.scss'
import './style/editor.scss'
import './style/document.scss'
import './style/syncingAnimation.scss'
import configureEditor from './configureEditor'


const getElementById = document.getElementById.bind(document)

document.addEventListener('DOMContentLoaded', () => {
  const documentContainer = getElementById('document-container')

  configureEditor(
    getElementById('editor-container'),
    documentContainer,
    getElementById('table-of-contents-container'))

  // Because we're using a scrolling panel, the browser fails to restore the
  // document's scroll position when the user navigates backward (or forward).
  //
  // To work around this, we save the user's scroll position every time they
  // click a link, then use the `popstate` event to manually restore their
  // scroll position.  
  function saveDocumentScrollPosition() {
    const { scrollTop } = documentContainer
    window.history.replaceState({ scrollTop }, '')
  }

  function recallDocumentScrollPosition(historyState) {
    if (historyState) {
      documentContainer.scrollTop = historyState.scrollTop
    }
  }

  // If the user scrolls halfway down the document, then navigates backward to
  // some external page, then navigates forward to return to our page again, we
  // want to be able to restore their scroll position. 
  window.addEventListener('beforeunload', () => {
    saveDocumentScrollPosition()
  })

  documentContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      saveDocumentScrollPosition()
    }
  })

  window.addEventListener('popstate', (event) => {
    const { state } = event
    recallDocumentScrollPosition(state)
  })

  // In Chrome, the `popstate` event does not fire when the user navigates
  // backward from an external page. 
  window.addEventListener('pageshow', () => {
    const { state } = window.history
    recallDocumentScrollPosition(state)
  })
})
