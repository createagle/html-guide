// <copy-button> copies text to the clipboard.
//   value="…"        the text to copy, or
//   for="some-id"    copy the value or text of that element
//   copied-label="…" what the button says after copying (default "Copied")
// Style it with ::part(button), ::part(icon), ::part(label) and --copy-button-* custom properties.

// A block keeps the template and class out of the global scope of a classic script
{
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      :host { display: inline-block; vertical-align: middle; }
      :host([hidden]) { display: none; }
      button {
        display: inline-flex; align-items: center; gap: 6px;
        font: inherit; font-size: var(--copy-button-font-size, 14px); color: inherit;
        padding: var(--copy-button-padding, 5px 12px);
        border: 1px solid var(--copy-button-border, currentColor);
        border-radius: var(--copy-button-radius, 6px);
        background: var(--copy-button-bg, transparent);
        cursor: pointer;
      }
      button:focus-visible { outline: 2px solid var(--copy-button-focus, Highlight); outline-offset: 2px; }
      svg { inline-size: 1em; block-size: 1em; flex: none; }
      .done { display: none; }
      /* The button keeps its name; "Copied" is visual only and announced by the status region */
      :host(:state(copied)) .idle, .sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
      :host(:state(copied)) .done { display: inline; }
      :host(:state(copied)) button { border-color: var(--copy-button-done, currentColor); }
    </style>
    <button type="button" part="button">
      <svg part="icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5"/>
      </svg>
      <span part="label"><span class="idle"><slot>Copy</slot></span><span class="done" aria-hidden="true"></span></span>
    </button>
    <span class="sr" role="status"></span>
  `;

  class CopyButton extends HTMLElement {
    static observedAttributes = ['copied-label'];
    #internals = this.attachInternals();
    #timer = 0;

    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.append(template.content.cloneNode(true));
      this.button = shadow.querySelector('button');
      this.done = shadow.querySelector('.done');
      this.status = shadow.querySelector('[role="status"]');
      this.button.addEventListener('click', () => this.copy());
    }

    // Properties reflect to attributes, like built-in elements
    get value() { return this.getAttribute('value') ?? ''; }
    set value(text) { this.setAttribute('value', text); }
    get htmlFor() { return this.getAttribute('for') ?? ''; }
    set htmlFor(id) { this.setAttribute('for', id); }
    get copiedLabel() { return this.getAttribute('copied-label') ?? 'Copied'; }
    set copiedLabel(text) { this.setAttribute('copied-label', text); }

    connectedCallback() { this.done.textContent = this.copiedLabel; }
    disconnectedCallback() { clearTimeout(this.#timer); }
    attributeChangedCallback() { this.done.textContent = this.copiedLabel; }

    get text() {
      if (this.hasAttribute('value')) return this.value;
      const source = this.getRootNode().getElementById?.(this.htmlFor);
      if (!source) return '';
      const field = source instanceof HTMLInputElement || source instanceof HTMLTextAreaElement;
      return field ? source.value : source.textContent.trim();
    }

    async copy() {
      try {
        await navigator.clipboard.writeText(this.text);
      } catch {
        this.status.textContent = 'Copy failed. Select the text and copy it yourself.';
        return;
      }
      this.#internals.states.add('copied');
      this.status.textContent = this.copiedLabel;
      this.dispatchEvent(new CustomEvent('copy-success', { bubbles: true, composed: true, detail: { text: this.text } }));
      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => {
        this.#internals.states.delete('copied');
        this.status.textContent = '';
      }, 2000);
    }
  }

  customElements.define('copy-button', CopyButton);
}
