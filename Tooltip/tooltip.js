class Tooltip extends HTMLElement {
    constructor() {
        console.log('It is working!');
        super();
        // this._tooltipContainer;
        this._tooltipIcon;
        this._tooltipVisible = false;
        this.attachShadow({ mode: 'open' });

        //backticks allow for multiple line strings.

        //* The following is conditional host formatting example *//
        // :host(.important) {
        //     background: var(--color-primary, #ccc)
        //     padding: 0.15rem;
        // }

        // :host-context(p) {
        //     font-weight: bold;
        // }

        this.shadowRoot.innerHTML = `
        <style>
            div {
                font-weight: normal;
                background-color: rgba(158, 158, 158, 1);
                color: black;
                position: absolute;
                top: 1.5rem;
                left: 0.75rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26)
                transofrm: translateY(-2rem);
                transition: all 200ms ease-in;
            }

            .open {
                transform: translateY(0rem);
                transition: all 100ms ease-in;
            }

            :host(.important) {
                background: var(--color-primary, #ccc)
                padding: 0.15rem;
            }

            :host {
                position: relative;
            }

            :host-context(p) {
                font-weight: bold;
            }

            .icon {
                background: black;
                color: white;
                padding: 0.15rem 0.5rem;
                text-align: center;
                border-radius: 50%;
            }

            

        </style>
        
        <slot>Tooltip Default Slot</slot>
        <span class = "icon">?</span>`
    };

    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text') || "No tooltip text defined. Set 'text' attribute.";
        }

        this._tooltipIcon = this.shadowRoot.querySelector('span');
        // tooltipIcon.textContent = ' (?)';
        this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        // this.shadowRoot.appendChild(tooltipIcon);
        // this.style.position = 'relative';
        this._render();
    };

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }
        if (name === 'text') {
            this._tooltipText = newValue;
        }
    }

    // add attributes here that you may want to change in external code.
    static get observedAttributes() {
        return ['text'];
    }

    //cleanup when element is removed here in disconnectedCallback
    //removing events is redundant. automatically done by browser. This is example. Use this function for stuff like http requests rather.
    disconnectedCallback() {
        console.log('disconnected');
        this._tooltipIcon.removeEventListener('mouseenter', this._showTooltip);
        this._tooltipIcon.removeEventListener('mouseleave', this._hideTooltip);
    }

    _render() {
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if (this._tooltipVisible) {
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText || "Tooltip required in tooltip.js";
            tooltipContainer.classList.add('.open');
            // this._tooltipContainer.style.backgroundColor = 'khaki';
            // this._tooltipContainer.style.color = 'white';
            // this._tooltipContainer.style.position = 'absolute';
            // this._tooltipContainer.style.zIndex = '10';

            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if (tooltipContainer)
                this.shadowRoot.removeChild(tooltipContainer);
            //   = document.createElement('div');
            // tooltipContainer.textContent = 'ttt';
            // this.appendChild(tooltipContainer);
        }

    }

    _showTooltip() {
        this._tooltipVisible = true;
        this._render();
        // this._tooltipContainer = document.createElement('div');
        // this._tooltipContainer.textContent = this._tooltipText || "Tooltip required in tooltip.js";
        // // this._tooltipContainer.style.backgroundColor = 'khaki';
        // // this._tooltipContainer.style.color = 'white';
        // // this._tooltipContainer.style.position = 'absolute';
        // // this._tooltipContainer.style.zIndex = '10';

        // this.shadowRoot.appendChild(this._tooltipContainer);
    }
    _hideTooltip() {
        this._tooltipVisible = false;
        this._render();
        //     this.shadowRoot.removeChild(this._tooltipContainer);
        //     //   = document.createElement('div');
        //     // tooltipContainer.textContent = 'ttt';
        //     // this.appendChild(tooltipContainer);
    }
}
customElements.define('ht-tooltip', Tooltip);