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
        this.itemListArr = '';
        this.selectedItem = '';
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('wrapper');

        this.settingsPanel = document.createElement('div');
        this.settingsPanel.classList.add('settings-panel');

        this.optionsPanel = document.createElement('div');
        this.optionsPanel.classList.add('options-panel');

        this.gridPanel = document.createElement('div');
        this.gridPanel.classList.add('grid-panel');

        this.grid = document.createElement('div');
        this.grid.classList.add('item-grid');


        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `

        <style>
            #item-info {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);             
                border-radius: 2px;
                background: #ffffff;
                padding: 10px 10px 10px 10px;
                margin: 5px 5px; 
            }

            .grid-item span{
                display: flex;
                justify-content: center;
            }

            .grid-item {
                display: flex;
                flex-direction: column;
                background: rgba(0,0,0,0.25);
                border-radius: 3px;
                box-shadow: 2px 2px 2px rgba(0,0,0,0.26);
                min-height: 30px; 
                padding: 5px;
                margin: 5px;
                justify-content: space-evenly;
                cursor: pointer;
            }

            .item-grid {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: rgba(0,0,0,0.0);
                margin: 5px 5px;
                height: inherit;
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

            .open {
                z-index: 100;
                pointer-events: all;
                opacity: 1;
                transform: translateY(0rem);
            }

            .settings-panel {
                display: flex;
                font-variant: all-small-caps;
                justify-content: flex-end;
                margin-right: 5px;
                position: relative;
            }

            .grid-panel {
                box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.26);
                margin: 5px;
                border-radius: 2px;
                display: inline-grid;
                flex-direction: column;
            }

            .wrapper {
                display: flex;
                width: fit-content;
            }
            
        </style>
        
        `
            ;
    };

    connectedCallback() {
        if (this.hasAttribute('value')) {
            this.itemListArr = this.getAttribute('value');
        }
    }

    open(itemListArr) {
        if (itemListArr) {
            this.itemListArr = itemListArr;
        }
        this.shadowRoot.appendChild(this.wrapper);
        this.wrapper.appendChild(this.gridPanel);
        this.gridPanel.appendChild(this.settingsPanel);
        this.settingsPanel.appendChild(this.optionsPanel);
        this.gridPanel.appendChild(this.grid);
        this.setAttribute('vertical', '');

        this._horizontal = false;
        this._vertical = true;

        let item = {};

        for (let i = 0; i < this.itemListArr.length; i++) {
            item = this.itemListArr[i];
            this.addGridItem(item);
        }
        this.style.width = "100%";
    }

    addGridItem(item) {
        let gridItem = document.createElement('div');
        if (item.id) {
            gridItem.setAttribute('id', item.id);
        }
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('click', this.setSelected.bind(this, gridItem, item));
        gridItem.addEventListener('mouseenter', () => {
            gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
        });
        gridItem.addEventListener('mouseleave', () => {
            gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.26)';
        });
        if (item.name) {
            let nameContainer = document.createElement('span');
            nameContainer.textContent = item.name;
            gridItem.appendChild(nameContainer);
        }

        this.grid.appendChild(gridItem);
        this.gridItems.push(gridItem);
    }

    addOptions(optionsArr) {

        if (optionsArr !== null && optionsArr.length >= 1) {
            console.log(optionsArr)
            this.grid.style.borderTop = '1px solid #ccc';
            let settingsPanel = this.settingsPanel;

            let optionsButton = document.createElement('span');
            optionsButton.classList.add('options-button');
            optionsButton.textContent = 'Options';
            optionsButton.addEventListener('click', () => {
                console.log('options clicked');
                this._onOptionClicked(optionsArr);
            });
            optionsButton.addEventListener('mouseenter', () => {
                optionsButton.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
            });
            optionsButton.addEventListener('mouseleave', () => {
                optionsButton.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.26)';
            });
            settingsPanel.appendChild(optionsButton);
        }
    }

    setSelected(gridItem, item) {
        gridItem.style.background = 'rgba(255,200,0,0.45)';
        gridItem.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
        this.selectedItem = item;
        for (let i = 0; i < this.gridItems.length; i++) {
            if (gridItem !== this.gridItems[i]) {
                this.gridItems[i].style.background = 'rgba(0,0,0,0.26)';
            }
        }
    }

    getSelected(){
        return this.selectedItem;
    }

    _onOptionClicked(optionsArr) {

        if (!this.optionsPanel.hasChildNodes()) {
            for (let i = 0; i < optionsArr.length; i++) {
                let option = optionsArr[i];
                console.log(option);
                let optionPanel = document.createElement('span');
                console.log(option.name)
                optionPanel.textContent = option.name;
                this.optionsPanel.appendChild(optionPanel);

                optionPanel.addEventListener('click', () => {
                    option.cb()
                    this.optionsPanel.classList.remove('open');
                });
                optionPanel.addEventListener('mouseenter', () => {
                    optionPanel.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.6)';
                });
                optionPanel.addEventListener('mouseleave', () => {
                    optionPanel.style.boxShadow = '0px 0px 0px rgba(0,0,0,0.0)';
                });
            }

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
                this.grid.style.flexDirection = 'row';
                this.wrapper.style.flexDirection = 'column';

                this.setAttribute('enablescroll', this.enableScroll)

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
                this.grid.style.flexDirection = 'column';
                this.wrapper.style.flexDirection = 'row';

                this.setAttribute('enablescroll', this.enableScroll)

            } else {
                this._vertical = false;
            }
        }

        if (name === 'enablescroll') {
            if (this.hasAttribute('enablescroll')) {
                this.enableScroll = this.getAttribute('enablescroll');
                if (this.enableScroll === "true" && this._vertical === true) {
                    let totalGridItems = this.gridItems.length;
                    this.grid.style.overflowY = 'auto';
                    this.grid.style.overflowX = 'hidden';
                    this.grid.style.height = 'inherit';
                } else {
                    this.grid.style.overflowY = 'hidden';
                    this.grid.style.height = 'fit-content';
                }

                if (this.enableScroll === "true" && this._horizontal === true) {
                    let totalGridItems = this.gridItems.length;
                    this.grid.style.overflowY = 'hidden';
                    this.grid.style.overflowX = 'auto';
                    this.grid.style.width = 'inherit';

                } else {
                    this.grid.style.overflowX = 'hidden';
                }

            } else {
                this.enableScroll = false;
            }
        }
    }
};

customElements.define('smdui-dg', DataGrid);