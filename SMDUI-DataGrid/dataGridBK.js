//datagrid.selectedItem
//datagrid.gridItems
//datagrid._vertical and _horizontal not to be changed. Only used to check condition. Changing them manually does nothing.

class DataGrid extends HTMLElement {
    constructor() {
        super();
        this._vertical = true;
        this._horizontal = false;
        this.enableScroll = true;
        this.gridItems = []; //storing items in grid
        this.selectedItem = '';
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `

        <style>

            #device-grid {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: rgba(0,0,0,0.0);
                border-top: 1px solid #ccc;
                margin: 5px 5px;
                height: inherit;
            }

            #device-info {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);             
                border-radius: 2px;
                background: #ffffff;
                padding: 10px 10px 10px 10px;
                margin: 5px 5px; 
            }

            #nav {
                display: flex;
                font-variant: all-small-caps;
                justify-content: flex-end;
                margin-right: 5px;
                margin-bottom: 10px;
                position: relative;
            }
            
            #main {
                display: flex;
                max-width: max-content;
                width: 100%;
            }

            .options-panel {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                background: rgba(230,230,230,1);
                position: absolute;
                z-index: -1;
                opacity:0;
                height: fit-content;
                width: fit-content;
                cursor: pointer;
                top: 1.5rem;
                padding: 2px;
                pointer-events: none;
                transform: translateY(-1rem);
                transition: transform 200ms cubic-bezier(0, -1.24, 0.56, 2.99), opacity 100ms ease-out;
            }

            #grid-panel {
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                margin: 5px 5px;
                border-radius: 2px;
                display: inline-grid;
                flex-direction: column;
            }

            .options-button {
                cursor: pointer;
                box-shadow: 1px 2px 3px rgba(0,0,0,0.26);
                background: rgba(0,0,0,0.08);
                margin-top: 3px;
                padding: 2px;
                height: fit-content;
                position: relative;
            }

            .open {
                z-index: 100;
                pointer-events: all;
                opacity: 1;
                transform: translateY(0rem);
            }

            .grid-item {
                display: flex;
                flex-direction: column;
                background: rgba(0,0,0,0.25);
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                min-height: 30px; 
                padding: 5px;
                margin: 5px;
                justify-content: space-evenly;
                cursor: pointer;
            }

            .grid-item span{
                display: flex;
                justify-content: center;
            }

            .data-values {
                display: flex;
                padding-left: 2rem;;
                padding-right: 2rem;
                justify-content: flex-end;
                width: 10%;
            }

            .actDataPanel {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                border-bottom: 1px solid #ccc;
                position: relative;
                margin: 2px;
            }

            .actDataPanel span {
                width: 100%
            }

        </style>
        
        <div id = "main">
            <div id = "grid-panel">
                <div id = "nav"><div class = "options-panel"></div></div>
                <div id = "device-grid"></div>
            </div>
        </div>
        `;

        this.gridSection = this.shadowRoot.querySelector("#device-grid");
        this.mainSection = this.shadowRoot.querySelector('#main');
        this.optionsPanel = this.shadowRoot.querySelector(".options-panel");
    };

    connectedCallback() {
        if(this.hasAttribute('value')){
            this.devListArr = this.getAttribute('value');
        }
    }

    open(devListArr) {
        if(devListArr){
            this.devListArr = devListArr;
        }
        this.setAttribute('vertical', '');

        this._horizontal = false;
        this._vertical = true;

        let device = {};
        let navBar = this.shadowRoot.querySelector("#nav");
        let optionsButton = document.createElement('span');
        optionsButton.classList.add('options-button');
        optionsButton.textContent = 'Options';
        optionsButton.addEventListener('click', () => {
            console.log('options clicked');
            this._onOptionsClicked();
        });
        optionsButton.addEventListener('mouseenter', () => {
            optionsButton.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
        });
        optionsButton.addEventListener('mouseleave', () => {
            optionsButton.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.26)';
        });
        navBar.appendChild(optionsButton);

        for (let i = 0; i < this.devListArr.length; i++) {
            device = this.devListArr[i];
            this._createGridItem(device);
        }
    }

    _createGridItem(device) {
        let gridItem = document.createElement('div');
        gridItem.setAttribute('id', device.serialNumber);
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('click', () => {
            gridItem.style.background = 'rgba(255,200,0,0.45)';
            gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';

            this.selectedItem = device; //references the selected device object which is extracted from the array passed to the datagrid object initially
            console.log(this.selectedItem);
            for (let i = 0; i < this.gridItems.length; i++) {
                if (gridItem.getAttribute('id') !== this.gridItems[i].getAttribute('id')) {
                    this.gridItems[i].style.background = 'rgba(0,0,0,0.25)';
                }
            }
        });
        gridItem.addEventListener('mouseenter', () => {
            gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';

        });
        gridItem.addEventListener('mouseleave', () => {
            gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.26)';
        });
        let devImageContainer = document.createElement('img');
        devImageContainer.textContent = '';
        gridItem.appendChild(devImageContainer);
        let devNameContainer = document.createElement('span');
        devNameContainer.textContent = device.deviceName;
        gridItem.appendChild(devNameContainer);
        this.gridSection.appendChild(gridItem);
        this.gridItems.push(gridItem);
    }

    _updateActualValues() {
        //not sure whether this should be done here

    };

    _onOptionsClicked() {

        if (!this.optionsPanel.hasChildNodes()) {
            let orientHorizontal = document.createElement('span');
            orientHorizontal.textContent = 'Horizontal';

            this.optionsPanel.appendChild(orientHorizontal);

            orientHorizontal.addEventListener('click', () => {
                this.setAttribute('horizontal', '');
                this.optionsPanel.classList.remove('open');
            });
            orientHorizontal.addEventListener('mouseenter', () => {
                orientHorizontal.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
            });
            orientHorizontal.addEventListener('mouseleave', () => {
                orientHorizontal.style.boxShadow = '0px 0px 0px rgba(0,0,0,0.0)';
            });

            let orientVertical = document.createElement('span');
            orientVertical.textContent = 'Vertical';
            this.optionsPanel.appendChild(orientVertical);
            orientVertical.addEventListener('click', () => {
                this.setAttribute('vertical', '');
                this.optionsPanel.classList.remove('open');
            });
            orientVertical.addEventListener('mouseenter', () => {
                orientVertical.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';

            });
            orientVertical.addEventListener('mouseleave', () => {
                orientVertical.style.boxShadow = '0px 0px 0px rgba(0,0,0,0.0)';
            });
        }

        this.optionsPanel.classList.add('open');

    };

    //the following is to listen to attributes changed

    static get observedAttributes() {
        return ['horizontal', 'vertical', 'enablescroll'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'horizontal') {
            if (this.hasAttribute('horizontal')) {
                this._horizontal = true;
                if (this.hasAttribute('vertical')) {
                    this.removeAttribute('vertical')
                }
                this.gridSection.style.flexDirection = 'row';
                this.mainSection.style.flexDirection = 'column';

                this.setAttribute('enablescroll', this.enableScroll)

                // if (this.enableScroll != 0 && this._vertical === true) {
                //     let totalGridItems = this.gridItems.length;
                //     this.gridSection.style.overflowY = 'scroll';
                //     this.gridSection.style.overflowX = 'hidden';
                // } else {
                //     this.gridSection.style.overflowY = 'hidden';
                // }

            } else {
                this._horizontal = false;
            }
        }

        if (name === 'vertical') {
            if (this.hasAttribute('vertical')) {
                this._vertical = true;
                if (this.hasAttribute('horizontal')) {
                    this.removeAttribute('horizontal')
                }
                this.gridSection.style.flexDirection = 'column';
                this.mainSection.style.flexDirection = 'row';

                this.setAttribute('enablescroll', this.enableScroll)


                // if (this.enableScroll != 0 && this._vertical === true) {
                //     let totalGridItems = this.gridItems.length;
                //     this.gridSection.style.overflowY = 'scroll';
                //     this.gridSection.style.overflowX = 'hidden';
                // } else {
                //     this.gridSection.style.overflowX = 'hidden';
                // }


            } else {
                this._vertical = false;
            }
        }

        if (name === 'enablescroll') {
            if (this.hasAttribute('enablescroll')) {
                this.enableScroll = this.getAttribute('enablescroll');
                if (this.enableScroll === "true" && this._vertical === true) {
                    let totalGridItems = this.gridItems.length;
                    this.gridSection.style.overflowY = 'auto';
                    this.gridSection.style.overflowX = 'hidden';
                    this.gridSection.style.height = 'inherit';
                }else {
                    this.gridSection.style.overflowY = 'hidden';
                    this.gridSection.style.height = 'fit-content';
                }
                
                if (this.enableScroll === "true" && this._horizontal === true) {
                    let totalGridItems = this.gridItems.length;
                    this.gridSection.style.overflowY = 'hidden';
                    this.gridSection.style.overflowX = 'auto';
                    this.gridSection.style.width = 'inherit';

                } else {
                    this.gridSection.style.overflowX = 'hidden';
                }

            } else {
                this.enableScroll = false;
            }
        }
    }
};

customElements.define('smdui-dg', DataGrid);